import { db } from '@/db/prisma';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/subjects';
import { HttpException } from '@/exceptions';
import { pagination } from '@/utils/pagination';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class SubjectService {
  async getAllSubjects(q?: QueryDto) {
    const { page, limit, name, studentId } = q || {};

    const { scores, ...orderBy } = q.orderBy || {};

    const where: Prisma.SubjectWhereInput = {
      name: {
        contains: name,
      },
      scores: studentId ? { some: { studentId } } : undefined,
      deletedAt: {
        equals: null,
      },
    };

    const [subjects, total] = await db.$transaction([
      db.subject.findMany({
        where,
        ...pagination(page, limit),
        select: {
          id: true,
          name: true,
          scores: studentId
            ? {
                where: {
                  studentId,
                },
                select: {
                  id: true,
                  studentId: true,
                  subjectId: true,
                  score: true,
                },
                orderBy: {
                  score: scores,
                },
              }
            : false,
          numCredits: true,
        },
        orderBy,
      }),
      db.subject.count({
        where,
      }),
    ]);

    return {
      subjects,
      total,
    };
  }

  async getSubjectById(id: string) {
    const subject = await db.subject.findUnique({
      where: {
        id,
      },
    });

    if (!subject) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Subject not found');
    }

    return subject;
  }

  async getSubjectByName(name: string) {
    const subject = await db.subject.findUnique({
      where: {
        name,
      },
    });

    if (!subject) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Subject not found');
    }

    return subject;
  }

  async createSubject(data: CreateDto) {
    const subjectExist = await db.subject.findUnique({
      where: {
        name: data.name,
      },
    });

    if (subjectExist) {
      throw new HttpException(StatusCodes.CONFLICT, `Subject with this name already exists`);
    }

    const subject = await db.subject.create({
      data,
    });

    return subject;
  }

  async updateSubject(id: string, data: UpdateDto) {
    try {
      const subject = await this.getSubjectById(id);

      const updatedSubject = await db.subject.update({
        where: {
          id,
        },
        data: {
          ...subject,
          ...data,
        },
      });

      return updatedSubject;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new HttpException(StatusCodes.CONFLICT, 'Subject with this name already exists');
      }

      throw error;
    }
  }

  async deleteSubject(id: string) {
    await this.getSubjectById(id);

    const deletedSubject = await db.subject.delete({
      where: {
        id,
      },
    });

    return deletedSubject;
  }

  async deleteSubjects(ids: string[]) {
    const deletedSubjects = await db.subject.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return deletedSubjects;
  }

  async getSubjectsByMssv(mssv: string) {
    const subjects = await db.subject.findMany({
      where: {
        scores: {
          some: {
            studentId: mssv,
          },
        },
      },
      select: {
        id: true,
        name: true,
        scores: {
          where: {
            studentId: mssv,
          },
          select: {
            id: true,
            studentId: true,
            subjectId: true,
            score: true,
          },
        },
        numCredits: true,
      },
    });

    return subjects;
  }
}

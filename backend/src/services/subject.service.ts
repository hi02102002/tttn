import { db } from '@/db/prisma';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/subjects';
import { HttpException } from '@/exceptions';
import { pagination } from '@/utils/pagination';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class SubjectService {
  async getAllSubjects(q?: QueryDto) {
    const { page, limit, name, studentId } = q || {};
    const subjects = await db.subject.findMany({
      where: {
        name: {
          contains: name,
        },
        scores: {
          some: {
            studentId,
          },
        },
      },
      ...pagination(page, limit),
      select: {
        id: true,
        name: true,
        scores: {
          where: {
            studentId,
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

  async createSubject(data: CreateDto) {
    const subjectExist = await db.subject.findUnique({
      where: {
        name: data.name,
      },
    });

    if (subjectExist) {
      throw new HttpException(StatusCodes.CONFLICT, `Subject with name ${data.name} already exists`);
    }

    const subject = await db.subject.create({
      data,
    });

    return subject;
  }

  async updateSubject(id: string, data: UpdateDto) {
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
}

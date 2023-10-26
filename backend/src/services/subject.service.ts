import { db } from '@/db/prisma';
import { AddSubjectsStudentDto } from '@/dtos/students';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/subjects';
import { HttpException } from '@/exceptions';
import { pagination } from '@/utils/pagination';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { Inject, Service } from 'typedi';
import { StudentService } from './student.service';

@Service()
export class SubjectService {
  constructor(@Inject(type => StudentService) private readonly studentService: StudentService) {}

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

  async getAverageScoreByMssv(mssv: string) {
    const student = await this.studentService.getStudentByMssv(mssv);

    if (!student) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Student not found');
    }

    const subjects = await db.$queryRaw`
    SELECT 
      subjects.subject_id as subjectId,
      subjects.name AS subjectName,
      ROUND(AVG(COALESCE(scores.score,0)),2) AS averageScore,
      ROUND(COALESCE(student_score.score),2) AS studentScore
    FROM subjects
    LEFT JOIN scores ON subjects.subject_id = scores.subject_id
    AND subjects.subject_id IN (
        SELECT DISTINCT subject_id
        FROM scores
        WHERE mssv = ${mssv} -- Replace with the specific student's mssv
    )
    INNER JOIN scores AS student_score ON subjects.subject_id = student_score.subject_id
    AND student_score.mssv = ${mssv} -- Replace with the specific student's mssv
    GROUP BY subjects.subject_id, subjects.name, student_score.score
    `;

    return subjects as Array<{
      subjectId: string;
      subjectName: string;
      averageScore: number;
    }>;
  }

  async getAllSubjectsNotOwnedByMssv(mssv: string) {
    const subjects = await db.subject.findMany({
      where: {
        deletedAt: null,
        NOT: {
          scores: {
            some: {
              studentId: mssv,
            },
          },
        },
      },
    });

    return subjects;
  }

  async addSubjectToStudent(mssv: string, fields: AddSubjectsStudentDto) {
    const student = await this.studentService.getStudentByMssv(mssv);

    if (!student) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Student not found');
    }

    const subjects = await db.subject.findMany({
      where: {
        id: {
          in: fields.subjects,
        },
      },
    });

    if (subjects.length !== fields.subjects.length) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Some subjects not found`);
    }

    await db.score.createMany({
      data: subjects.map(subject => ({
        studentId: mssv,
        subjectId: subject.id,
        score: null,
      })),
      skipDuplicates: true,
    });
  }
}

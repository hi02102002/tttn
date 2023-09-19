import { db } from '@/db/prisma';
import { QueryDto, UpdateDto } from '@/dtos/score';
import { HttpException } from '@/exceptions';
import { pagination } from '@/utils/pagination';
import { Prisma } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class ScoreService {
  async getAllScores(q?: QueryDto) {
    const { page, limit, subjectId, mssv, studentName, classId, orderBy } = q || {};

    if (orderBy?.student) {
      orderBy.student = {
        name: orderBy.student as unknown as Prisma.SortOrder,
      };
    }

    if (orderBy?.subject) {
      orderBy.subject = {
        name: orderBy.subject as unknown as Prisma.SortOrder,
      };
    }

    if (orderBy?.class) {
      orderBy.student = {
        class: {
          name: orderBy.class as unknown as Prisma.SortOrder,
        },
      };
      orderBy.class = undefined;
    }

    if (orderBy?.mssv) {
      orderBy.student = {
        mssv: orderBy.mssv as unknown as Prisma.SortOrder,
      };
      orderBy.mssv = undefined;
    }

    const where: Prisma.ScoreWhereInput = {
      subjectId,
      student: {
        classId,
        mssv,
        name: {
          contains: studentName,
        },
      },
    };

    const [scores, total] = await db.$transaction([
      db.score.findMany({
        where,
        ...pagination(page, limit),
        select: {
          score: true,
          student: {
            select: {
              name: true,
              mssv: true,
              class: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          subject: {
            select: {
              name: true,
              id: true,
            },
          },
          id: true,
        },
        orderBy,
      }),
      db.score.count({ where }),
    ]);
    return {
      scores,
      total,
    };
  }

  async updateScoreStudent(data: UpdateDto) {
    const score = await db.score.findUnique({
      where: {
        studentId_subjectId: {
          studentId: data.mssv,
          subjectId: data.subjectId,
        },
      },
    });

    if (!score) {
      throw new HttpException(404, 'Student with this subject not found');
    }

    const updated = await db.score.update({
      where: {
        studentId_subjectId: {
          studentId: data.mssv,
          subjectId: data.subjectId,
        },
      },
      data: {
        score: data.score,
      },
    });

    return updated;
  }
}

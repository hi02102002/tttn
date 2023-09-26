import { db } from '@/db/prisma';
import { AddSubjectsDto, CreateDto, QueryDto, UpdateDto } from '@/dtos/students';
import { HttpException } from '@/exceptions';
import { pagination } from '@/utils/pagination';
import { Class, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { Service } from 'typedi';
import { ClassService } from './class.service';
import { AuthService } from './auth.service';
@Service()
export class StudentService {
  constructor(private readonly classService: ClassService, private readonly authservice: AuthService) {}

  async getAllStudents(q?: QueryDto) {
    const { page, limit, name, address, classId, orderBy } = q || {};

    if (orderBy?.class) {
      orderBy.class = {
        name: orderBy.class as unknown as Prisma.SortOrder,
      };
    }

    const where: Prisma.StudentWhereInput = {
      name: {
        contains: name,
      },
      address: {
        contains: address,
      },
      classId,
    };

    const [students, total] = await db.$transaction([
      db.student.findMany({
        where,
        include: {
          class: true,
        },
        ...pagination(page, limit),
        orderBy,
      }),
      db.student.count({
        where,
      }),
    ]);

    return {
      total,
      students,
    };
  }

  async getStudentByMssv(mssv: string) {
    const student = await db.student.findUnique({
      where: {
        mssv,
      },
    });

    if (!student) {
      throw new HttpException(StatusCodes.NOT_FOUND, `Student with this MSSV not found`);
    }

    return student;
  }

  async createStudent(data: CreateDto) {
    const _class = await this.classService.getClassById(data.classId);

    let mssv = await this.generateMssv(_class);

    let studentExist = await db.student.findUnique({
      where: {
        mssv,
      },
    });

    let userExist = await db.user.findUnique({
      where: {
        username: mssv,
      },
    });

    let count = 0;

    while (studentExist) {
      count++;
      mssv = await this.generateMssv(_class, count);
      studentExist = await db.student.findUnique({
        where: {
          mssv,
        },
      });
    }

    count = 0;
    while (userExist) {
      count++;
      mssv = await this.generateMssv(_class, count);
      userExist = await db.user.findUnique({
        where: {
          username: mssv,
        },
      });
    }

    console.log(mssv);

    const user = await this.authservice.register({
      username: mssv,
      password: mssv,
      confirmPassword: mssv,
    });

    const student = await db.student.create({
      data: {
        ...data,
        mssv,
        userId: user.id,
      },
      include: {
        class: true,
      },
    });

    return student;
  }

  async generateMssv(_class: Class, count = 0) {
    const classes = await db.class.findMany({
      where: {
        academicYear: _class.academicYear,
      },
      select: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    const numStudents =
      classes.reduce((acc, cur) => {
        return acc + cur._count.students;
      }, 0) + count;

    const currentDate = new Date();

    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is two digits (zero-padded)
    const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure day is two digits (zero-padded)

    const mssv = `${_class.academicYear}${month}${day}${numStudents.toString().padStart(3, '0')}`;

    return mssv;
  }

  async updateStudent(mssv: string, body: UpdateDto) {
    const student = await this.getStudentByMssv(mssv);

    const updatedStudent = await db.student.update({
      where: {
        mssv,
      },
      data: {
        ...student,
        ...body,
      },
      include: {
        class: true,
      },
    });

    return updatedStudent;
  }

  async deleteStudent(mssv: string) {
    await this.getStudentByMssv(mssv);

    const deletedStudent = await db.student.delete({
      where: {
        mssv,
      },
    });

    return deletedStudent;
  }

  async getStudentsByClassId(classId: string) {
    const students = await db.student.findMany({
      where: {
        classId,
      },
    });

    return students;
  }

  async deleteManyStudents(mssvs: string[]) {
    const deletedStudents = await db.student.deleteMany({
      where: {
        mssv: {
          in: mssvs,
        },
      },
    });

    return deletedStudents;
  }

  async addSubjectToStudent({ mssv, subjectIds }: AddSubjectsDto) {
    await this.getStudentByMssv(mssv);

    const subjects = await db.subject.findMany({
      where: {
        id: {
          in: subjectIds,
        },
      },
    });

    if (subjects.length !== subjectIds.length) {
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

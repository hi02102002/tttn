import { db } from '@/db/prisma';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/students';
import { HttpException } from '@/exceptions';
import { pagination } from '@/utils/pagination';
import { Class, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { Inject, Service } from 'typedi';
import { ClassService } from './class.service';
@Service()
export class StudentService {
  @Inject()
  private readonly classService: ClassService;

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
    console.log(this.classService);
    const _class = await this.classService.getClassById(data.classId);

    let mssv = await this.generateMssv(_class);

    let studentExist = await db.student.findUnique({
      where: {
        mssv,
      },
    });
    while (studentExist) {
      mssv = await this.generateMssv(_class);
      studentExist = await db.student.findUnique({
        where: {
          mssv,
        },
      });
    }

    const student = await db.student.create({
      data: {
        ...data,
        mssv,
      },
      include: {
        class: true,
      },
    });

    return student;
  }

  async generateMssv(_class: Class) {
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

    const numStudents = classes.reduce((acc, cur) => {
      return acc + cur._count.students;
    }, 0);

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
}

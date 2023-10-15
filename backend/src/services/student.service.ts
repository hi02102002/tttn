import { scoreTenToAcademicRank, scoreTenToFour, scoreTenToLetter } from '@/constants';
import { db } from '@/db/prisma';
import { AddSubjectsDto, CreateDto, ExportDto, QueryDto, UpdateDto } from '@/dtos/students';
import { HttpException } from '@/exceptions';
import { pagination } from '@/utils/pagination';
import { Class, Prisma, Subject } from '@prisma/client';
import ExcelJS from 'exceljs';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';
import 'reflect-metadata';
import { Inject, Service } from 'typedi';
import { AuthService } from './auth.service';
import { ClassService } from './class.service';
import { SubjectService } from './subject.service';
@Service()
export class StudentService {
  @Inject(type => SubjectService)
  private readonly subjectService: SubjectService;

  constructor(private readonly classService: ClassService, private readonly authService: AuthService) {}

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
      include: {
        class: true,
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

    const student = await db.student.create({
      data: {
        ...data,
        mssv,
      },
      include: {
        class: true,
      },
    });

    try {
      await this.authService.register({
        username: mssv,
        password: mssv,
        confirmPassword: mssv,
        fullName: data.name,
        studentId: student.mssv,
      });
    } catch (error) {
      await db.student.delete({
        where: {
          mssv,
        },
      });

      throw error;
    }
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
        ...omit(student, ['class']),
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

  async exportSubjectStudent(data: ExportDto) {
    const student = await this.getStudentByMssv(data.mssv);

    const subjects = await this.subjectService.getSubjectsByMssv(data.mssv);

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet('List subjects');

    sheet.getColumn('B').width = 30;
    sheet.mergeCells('A2:E2');
    sheet.mergeCells('A3:E3');
    sheet.mergeCells('I2:O2');
    sheet.mergeCells('I3:O3');
    sheet.mergeCells('I4:O4');
    sheet.mergeCells('A6:O6');
    sheet.mergeCells('B8:D8');
    sheet.mergeCells('E8:G8');
    sheet.mergeCells('H8:I8');
    sheet.mergeCells('J8:K8');
    sheet.mergeCells('L8:M8');
    sheet.mergeCells('N8:O8');

    const A2 = sheet.getCell('A2');
    const A3 = sheet.getCell('A3');
    const I2 = sheet.getCell('I2');
    const I3 = sheet.getCell('I3');
    const I4 = sheet.getCell('I4');
    const A6 = sheet.getCell('A6');
    const A8 = sheet.getCell('A8');
    const B8 = sheet.getCell('B8');
    const E8 = sheet.getCell('E8');
    const H8 = sheet.getCell('H8');
    const J8 = sheet.getCell('J8');
    const L8 = sheet.getCell('L8');
    const N8 = sheet.getCell('N8');

    A2.value = 'BỘ GIÁO DỤC VÀ ĐÀO TẠO';
    A3.value = 'Đại học Giao Thông Vận Tải TP.HCM';
    A2.alignment = { horizontal: 'center' };
    A3.alignment = { horizontal: 'center' };
    A2.font = { bold: true };
    A3.font = { bold: true };
    I2.value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
    I3.value = 'Độc lập - Tự do - Hạnh phúc';
    I2.alignment = { horizontal: 'center' };
    I3.alignment = { horizontal: 'center' };
    I2.font = { bold: true };
    I3.font = { bold: true };
    I4.value = `Hồ Chí Minh, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`;
    I4.alignment = { horizontal: 'center' };
    I4.font = {
      italic: true,
    };

    A6.value = `BẢNG ĐIỂM ${student.name}`.toUpperCase();
    A6.alignment = { horizontal: 'center' };
    A6.font = { bold: true };

    A8.value = 'STT';
    A8.alignment = { horizontal: 'center' };
    A8.font = { bold: true };
    B8.value = 'Mã môn học';
    B8.alignment = { horizontal: 'center' };
    B8.font = { bold: true };
    E8.value = 'Tên môn học';
    E8.alignment = { horizontal: 'center' };
    E8.font = { bold: true };
    H8.value = 'Tính chỉ';
    H8.alignment = { horizontal: 'center' };
    H8.font = { bold: true };
    J8.value = 'Điểm (điểm 10)';
    J8.font = { bold: true };
    J8.alignment = { horizontal: 'center' };
    L8.value = 'Điểm (điểm 4)';
    L8.font = { bold: true };
    L8.alignment = { horizontal: 'center' };
    N8.value = 'Điểm chữ';
    N8.font = { bold: true };
    N8.alignment = { horizontal: 'center' };

    sheet.getRow(8).eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    const nextRow = 9;

    if (subjects.length === 0) {
      sheet.mergeCells(`A${nextRow}:O${nextRow}`);

      const A = sheet.getCell(`A${nextRow}`);

      A.value = 'Không có dữ liệu';
      A.alignment = { horizontal: 'center' };
      A.font = { bold: true };

      sheet.getRow(nextRow).eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      return workbook;
    }

    const totalRow = subjects.length + nextRow;
    for (let i = 0; i < subjects.length; i++) {
      const row = sheet.getRow(i + nextRow);
      const subject = subjects[i];

      sheet.mergeCells(`B${i + nextRow}:D${i + nextRow}`);
      sheet.mergeCells(`E${i + nextRow}:G${i + nextRow}`);
      sheet.mergeCells(`H${i + nextRow}:I${i + nextRow}`);
      sheet.mergeCells(`J${i + nextRow}:K${i + nextRow}`);
      sheet.mergeCells(`L${i + nextRow}:M${i + nextRow}`);
      sheet.mergeCells(`N${i + nextRow}:O${i + nextRow}`);

      const A = row.getCell('A');
      const B = row.getCell('B');
      const E = row.getCell('E');
      const H = row.getCell('H');
      const J = row.getCell('J');
      const L = row.getCell('L');
      const N = row.getCell('N');

      A.value = i + 1;
      A.alignment = { horizontal: 'center' };
      B.value = subject.id;
      B.alignment = { horizontal: 'center' };
      E.value = subject.name;
      E.alignment = { horizontal: 'center' };
      H.value = subject.numCredits;
      H.alignment = { horizontal: 'center' };

      const score = subject.scores[0]?.score;

      J.value = score?.toNumber() || 'N/A';
      J.alignment = { horizontal: 'center' };
      L.value = score ? scoreTenToFour(score.toNumber()) : 'N/A';
      L.alignment = { horizontal: 'center' };
      N.value = score ? scoreTenToLetter(score.toNumber()) : 'N/A';
      N.alignment = { horizontal: 'center' };

      sheet.getRow(i + nextRow).eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    sheet.mergeCells(`A${totalRow + 1}:D${totalRow + 1}`);
    sheet.mergeCells(`A${totalRow + 2}:D${totalRow + 2}`);
    sheet.mergeCells(`E${totalRow + 1}:I${totalRow + 1}`);
    sheet.mergeCells(`E${totalRow + 2}:I${totalRow + 2}`);
    sheet.mergeCells(`A${totalRow + 3}:D${totalRow + 3}`);

    const A1 = sheet.getCell(`A${totalRow + 1}`);
    const A2_ = sheet.getCell(`A${totalRow + 2}`);
    const E1 = sheet.getCell(`E${totalRow + 1}`);
    const E2 = sheet.getCell(`E${totalRow + 2}`);
    const A3_ = sheet.getCell(`A${totalRow + 3}`);

    A1.value = `Tổng số tín chỉ tích lũy: ${this.calcTotalCredits(subjects)}`;
    A1.alignment = { horizontal: 'left' };
    A1.font = { bold: true };

    A2_.value = `Tổng số tín chỉ đã đạt: ${this.calcCreditsPassed(subjects)}`;
    A2_.alignment = { horizontal: 'left' };
    A2_.font = { bold: true };

    A3_.value = `Học lực: ${scoreTenToAcademicRank(this.calcGpa10(subjects))}`;
    A3_.alignment = { horizontal: 'left' };
    A3_.font = { bold: true };

    E1.value = `Điểm trung bình tích lũy (thang 10): ${this.calcGpa10(subjects).toFixed(2)}`;
    E1.alignment = { horizontal: 'left' };
    E1.font = { bold: true };

    E2.value = `Điểm trung bình tích lũy (thang 4): ${scoreTenToFour(this.calcGpa10(subjects))}`;
    E2.alignment = { horizontal: 'left' };
    E2.font = { bold: true };

    for (let i = 1; i <= 2; i++) {
      sheet.getRow(totalRow + i).eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    sheet.getRow(totalRow + 3).eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    return workbook;
  }

  calcTotalCredits(subjects: Array<Omit<Subject, 'deletedAt'>>) {
    const totalCredits = subjects.reduce((acc, cur) => {
      return acc + cur.numCredits;
    }, 0);

    return totalCredits;
  }

  calcCreditsPassed(
    subjects: Array<
      Omit<Subject, 'deletedAt'> & {
        scores: {
          score: Prisma.Decimal;
        }[];
      }
    >,
  ) {
    const creditsPassed = subjects.reduce((acc, cur) => {
      if (cur.scores[0]?.score?.toNumber() >= 4) {
        return acc + cur.numCredits;
      }

      return acc;
    }, 0);

    return creditsPassed;
  }

  calcGpa10(
    subjects: Array<
      Omit<Subject, 'deletedAt'> & {
        scores: {
          score: Prisma.Decimal;
        }[];
      }
    >,
  ) {
    const totalCredits = this.calcTotalCredits(subjects);

    const gpa10 = subjects.reduce((acc, cur) => {
      if (!cur.scores[0]?.score) {
        return acc;
      }

      return acc + cur.scores[0].score.toNumber() * cur.numCredits;
    }, 0);

    return gpa10 / totalCredits;
  }
}

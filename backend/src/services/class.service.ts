import { db } from '@/db/prisma';
import { CreateDto, ExportDto, QueryDto } from '@/dtos/classes';
import { HttpException } from '@/exceptions';
import { pagination } from '@/utils/pagination';
import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class ClassService {
  async getAllClasses(q?: QueryDto) {
    const { page, limit, name, academicYear, orderBy } = q || {};

    if (orderBy?.students) {
      orderBy.students = {
        _count: orderBy.students as unknown as Prisma.SortOrder,
      };
    }

    const where: Prisma.ClassWhereInput = {
      name: {
        contains: name,
      },
      academicYear,
    };

    const [classes, total] = await db.$transaction([
      db.class.findMany({
        where,
        ...pagination(page, limit),
        include: {
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: {
          academicYear: orderBy?.academicYear,
          name: orderBy?.name,
          students: orderBy?.students,
        },
      }),
      db.class.count({
        where,
      }),
    ]);

    return {
      classes,
      total,
    };
  }

  async getClassById(id: string) {
    const _class = await db.class.findUnique({
      where: {
        id,
      },
    });

    if (!_class) {
      throw new HttpException(StatusCodes.NOT_FOUND, `Class with this id not found`);
    }

    return _class;
  }

  async createClass(data: CreateDto) {
    const classExist = await db.class.findUnique({
      where: {
        name: data.name,
      },
    });

    if (classExist) {
      throw new HttpException(StatusCodes.CONFLICT, `Class with this name already exists`);
    }

    const _class = await db.class.create({
      data,
    });
    return _class;
  }

  async updateClass(id: string, data: CreateDto) {
    try {
      const _class = await db.class.findUnique({
        where: {
          id,
        },
      });

      if (!_class) {
        throw new HttpException(StatusCodes.NOT_FOUND, `Class with this id not found`);
      }

      const updatedClass = await db.class.update({
        where: {
          id,
        },
        data,
      });

      return updatedClass;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new HttpException(StatusCodes.CONFLICT, `Class with this name already exists`);
      }

      throw error;
    }
  }

  async deleteClass(id: string) {
    const _class = await db.class.findUnique({
      where: {
        id,
      },
    });

    if (!_class) {
      throw new HttpException(StatusCodes.NOT_FOUND, `Class with this id not found`);
    }

    const deletedClass = await db.class.delete({
      where: {
        id,
      },
    });

    return deletedClass;
  }

  async deleteClasses(ids: string[]) {
    const classes = await db.class.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return classes;
  }

  async exportAllClassesWithStudent({ classId }: ExportDto) {
    const classes = await db.class.findMany({
      where: {
        id: classId,
      },
      include: {
        students: {
          orderBy: {
            mssv: 'asc',
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();

    for (const _class of classes) {
      if (_class.students.length === 0) {
        continue;
      }
      const sheet = workbook.addWorksheet(_class.name);

      sheet.mergeCells('A2:E2');
      sheet.mergeCells('A3:E3');
      sheet.mergeCells('G2:M2');
      sheet.mergeCells('G3:M3');
      sheet.mergeCells('G4:M4');
      sheet.mergeCells('A6:M6');
      sheet.mergeCells('B8:D8');
      sheet.mergeCells('E8:G8');
      sheet.mergeCells('H8:J8');

      const A2 = sheet.getCell('A2');
      const A3 = sheet.getCell('A3');
      const G2 = sheet.getCell('G2');
      const G3 = sheet.getCell('G3');
      const G4 = sheet.getCell('G4');
      const A6 = sheet.getCell('A6');
      const A8 = sheet.getCell('A8');
      const B8 = sheet.getCell('B8');
      const E8 = sheet.getCell('E8');
      const H8 = sheet.getCell('H8');
      const H = sheet.getColumn('H');
      H.width = 30;
      A2.value = 'BỘ GIÁO DỤC VÀ ĐÀO TẠO';
      A3.value = 'Đại học Giao Thông Vận Tải TP.HCM';
      A2.alignment = { horizontal: 'center' };
      A3.alignment = { horizontal: 'center' };
      A2.font = { bold: true };
      A3.font = { bold: true };
      G2.value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
      G3.value = 'Độc lập - Tự do - Hạnh phúc';
      G2.alignment = { horizontal: 'center' };
      G3.alignment = { horizontal: 'center' };
      G2.font = { bold: true };
      G3.font = { bold: true };
      G4.value = `Hồ Chí Minh, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`;
      G4.alignment = { horizontal: 'center' };
      G4.font = {
        italic: true,
      };

      A6.value = `DANH SÁCH SINH VIÊN LỚP ${_class.name.toUpperCase()}`;
      A6.alignment = { horizontal: 'center' };
      A6.font = { bold: true };

      A8.value = 'STT';
      A8.alignment = { horizontal: 'center' };
      A8.font = { bold: true };
      B8.value = 'MSSV';
      B8.alignment = { horizontal: 'center' };
      B8.font = { bold: true };
      E8.value = 'Họ và tên';
      E8.alignment = { horizontal: 'center' };
      E8.font = { bold: true };
      H8.value = 'Địa chỉ';
      H8.alignment = { horizontal: 'center' };
      H8.font = { bold: true };

      sheet.getRow(8).eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      for (let i = 0; i < _class.students.length; i++) {
        const student = _class.students[i];
        const row = sheet.getRow(i + 9);

        sheet.mergeCells(`B${i + 9}:D${i + 9}`);
        sheet.mergeCells(`E${i + 9}:G${i + 9}`);
        sheet.mergeCells(`H${i + 9}:J${i + 9}`);

        const A = row.getCell('A');
        const B = row.getCell('B');
        const E = row.getCell('E');
        const H = row.getCell('H');

        A.value = i + 1;
        A.alignment = { horizontal: 'center' };
        B.value = Number(student.mssv);
        B.alignment = { horizontal: 'center' };
        E.value = student.name;
        E.alignment = { horizontal: 'center' };
        H.value = student.address;
        H.alignment = { horizontal: 'center' };

        sheet.getRow(i + 9).eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }

      const maxWidthLimit = 30; // Adjust this value to your desired maximum width
    }

    return workbook;
  }

  getColumns(): Partial<ExcelJS.Column>[] {
    return [
      {
        header: 'MSSV',
        key: 'mssv',
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'FF00FF00',
          },
        },
      },
      {
        header: 'Name',
        key: 'name',
      },
      {
        header: 'Address',
        key: 'address',
      },
    ];
  }

  fitWidthColumns(sheet: ExcelJS.Worksheet) {
    sheet.columns.forEach(column => {
      let maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
  }
}

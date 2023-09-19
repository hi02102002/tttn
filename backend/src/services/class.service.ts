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
        students: true,
      },
    });

    const workbook = new ExcelJS.Workbook();

    classes.map(async _class => {
      const sheet = workbook.addWorksheet(_class.name);

      sheet.columns = this.getColumns();

      this.fitWidthColumns(sheet);

      for (const student of _class.students) {
        sheet.addRow({
          mssv: student.mssv,
          name: student.name,
          address: student.address,
        });
      }
    });

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

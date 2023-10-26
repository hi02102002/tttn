import { CreateDto, ExportDto } from '@/dtos/classes';
import { ClassService } from '@/services';
import { catchAsync } from '@/utils/catch-async';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';

export class ClassController {
  private readonly classService = Container.get(ClassService);

  public getAllClasses = catchAsync(async (req, res) => {
    const data = await this.classService.getAllClasses(req.query as any);
    res.status(StatusCodes.OK).json({
      message: 'Get all classes successfully',
      data,
    });
  });

  public getClassById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const _class = await this.classService.getClassById(id);
    res.status(StatusCodes.OK).json({
      message: 'Get class by id successfully',
      data: _class,
    });
  });

  public createClass = catchAsync(async (req, res) => {
    const data = req.body as CreateDto;
    const _class = await this.classService.createClass(data);
    res.status(StatusCodes.CREATED).json({
      message: `Create class ${_class.name} successfully`,
      data: _class,
    });
  });

  public updateClass = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const _class = await this.classService.updateClass(id, data);
    res.status(StatusCodes.OK).json({
      message: `Update class ${_class.name} successfully`,
      data: _class,
    });
  });

  public deleteClass = catchAsync(async (req, res) => {
    const { id } = req.params;
    const _class = await this.classService.deleteClass(id);
    res.status(StatusCodes.OK).json({
      message: `Delete class ${_class.name} successfully`,
    });
  });

  public deleteClasses = catchAsync(async (req, res) => {
    const classes = await this.classService.deleteClasses(req.body.ids);

    res.status(StatusCodes.OK).json({
      message: `Delete ${classes.count} classrooms successfully`,
    });
  });

  public exportClasses = catchAsync(async (req, res): Promise<any> => {
    const dto: ExportDto = req.body;
    const workbook = await this.classService.exportAllClassesWithStudent(dto);

    if (dto.classId && dto.type === 'pdf') {
      // const buffer = await workbook.xlsx.writeBuffer();

      // const _res = await convertExcelToPdf(buffer);

      const _res = await this.classService.exportAllStudentPdf(dto);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${dto.classId}.pdf`);

      return res.send(_res);
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${dto.classId}.xlsx`);
    return await workbook.xlsx.write(res);
  });
}

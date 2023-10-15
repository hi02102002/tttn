import { StudentService } from '@/services';
import { catchAsync } from '@/utils/catch-async';
import { convertExcelToPdf } from '@/utils/convert-excel-pdf';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';

export class StudentController {
  private readonly studentService = Container.get(StudentService);

  public getAllStudents = catchAsync(async (req, res) => {
    const data = await this.studentService.getAllStudents(req.query as any);
    res.status(StatusCodes.OK).json({
      message: 'Get all students successfully',
      data,
    });
  });

  public getStudentByMssv = catchAsync(async (req, res) => {
    const student = await this.studentService.getStudentByMssv(req.params.mssv);
    res.status(StatusCodes.OK).json({
      message: 'Get student by MSSV successfully',
      data: student,
    });
  });

  public createStudent = catchAsync(async (req, res) => {
    const student = await this.studentService.createStudent(req.body);
    res.status(StatusCodes.CREATED).json({
      message: `Create student with MSSV ${student.mssv} successfully`,
      data: student,
    });
  });

  public updateStudent = catchAsync(async (req, res) => {
    const student = await this.studentService.updateStudent(req.params.mssv, req.body);
    res.status(StatusCodes.OK).json({
      message: `Update student with MSSV ${student.mssv} successfully`,
      data: student,
    });
  });

  public deleteStudent = catchAsync(async (req, res) => {
    await this.studentService.deleteStudent(req.params.mssv);
    res.status(StatusCodes.OK).json({
      message: `Delete student with MSSV ${req.params.mssv} successfully`,
    });
  });

  public deleteManyStudents = catchAsync(async (req, res) => {
    await this.studentService.deleteManyStudents(req.body.mssv);
    res.status(StatusCodes.OK).json({
      message: `Delete ${req.body.mssv.length} students successfully`,
    });
  });

  public addSubjects = catchAsync(async (req, res) => {
    await this.studentService.addSubjectToStudent(req.body);
    res.status(StatusCodes.OK).json({
      message: `Add subjects to student with MSSV ${req.body.mssv} successfully`,
    });
  });

  public exportSubjectStudent = catchAsync(async (req, res): Promise<any> => {
    const workbook = await this.studentService.exportSubjectStudent(req.body);

    if (req.body.type === 'pdf') {
      const buffer = await workbook.xlsx.writeBuffer();

      const _res = await convertExcelToPdf(buffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${req.body.mssv}.pdf`);

      return res.send(_res);
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=dsd.xlsx');

    await workbook.xlsx.write(res);
  });
}

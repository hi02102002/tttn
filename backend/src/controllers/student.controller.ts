import { StudentService } from '@/services';
import { catchAsync } from '@/utils/catch-async';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';

export class StudentController {
  private readonly studentService = Container.get(StudentService);

  public getAllStudents = catchAsync(async (req, res) => {
    const students = await this.studentService.getAllStudents();
    res.status(StatusCodes.OK).json({
      message: 'Get all students successfully',
      data: students,
    });
  });

  public getStudentByMssv = catchAsync(async (req, res) => {
    const student = await this.studentService.getStudentByMssv(req.params.mssv);
    res.status(StatusCodes.OK).json({
      message: 'Get student by id successfully',
      data: student,
    });
  });

  public createStudent = catchAsync(async (req, res) => {
    const student = await this.studentService.createStudent(req.body);
    res.status(StatusCodes.CREATED).json({
      message: `Create student with mssv ${student.mssv} successfully`,
      data: student,
    });
  });

  public updateStudent = catchAsync(async (req, res) => {
    const student = await this.studentService.updateStudent(req.params.mssv, req.body);
    res.status(StatusCodes.OK).json({
      message: `Update student with mssv ${student.mssv} successfully`,
      data: student,
    });
  });

  public deleteStudent = catchAsync(async (req, res) => {
    await this.studentService.deleteStudent(req.params.mssv);
    res.status(StatusCodes.OK).json({
      message: `Delete student with mssv ${req.params.mssv} successfully`,
    });
  });
}

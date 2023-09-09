import { StudentController } from '@/controllers';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/students';
import { Routes } from '@/interfaces/routes.interface';
import { validate } from '@/middlewares';
import { Router } from 'express';

export class StudentRoute implements Routes {
  public path = '/students';
  public router = Router();
  public controller = new StudentController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      `${this.path}`,
      validate({
        type: QueryDto,
        typeInput: 'query',
      }),
      this.controller.getAllStudents,
    );
    this.router.get(`${this.path}/:mssv`, this.controller.getStudentByMssv);
    this.router.post(
      `${this.path}`,
      validate({
        type: CreateDto,
      }),
      this.controller.createStudent,
    );
    this.router.patch(
      `${this.path}/:mssv`,
      validate({
        type: UpdateDto,
      }),
      this.controller.updateStudent,
    );
    this.router.delete(`${this.path}/:mssv`, this.controller.deleteStudent);
  }
}

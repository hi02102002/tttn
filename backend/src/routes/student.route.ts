import { StudentController } from '@/controllers';
import { CreateDto, DeleteStudentsDto, QueryDto, UpdateDto } from '@/dtos/students';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware, validate } from '@/middlewares';
import { roles } from '@/middlewares/roles.middleware';
import { RoleName } from '@prisma/client';
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
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.getAllStudents,
    );
    this.router.get(`${this.path}/:mssv`, AuthMiddleware, this.controller.getStudentByMssv);
    this.router.post(
      `${this.path}`,
      validate({
        type: CreateDto,
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.createStudent,
    );
    this.router.patch(
      `${this.path}/:mssv`,
      validate({
        type: UpdateDto,
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.updateStudent,
    );
    this.router.delete(`${this.path}/:mssv`, this.controller.deleteStudent);
    this.router.delete(
      `${this.path}`,
      validate({
        type: DeleteStudentsDto,
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.deleteManyStudents,
    );
    this.router.post(`${this.path}/add-subjects`, AuthMiddleware, roles([RoleName.ADMIN]), this.controller.addSubjects);
    this.router.get(`${this.path}/export/:mssv`, AuthMiddleware, this.controller.exportSubjectStudent);
  }
}

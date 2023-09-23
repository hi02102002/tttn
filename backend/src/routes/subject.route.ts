import { SubjectController } from '@/controllers';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/subjects';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware, validate } from '@/middlewares';
import { roles } from '@/middlewares/roles.middleware';
import { RoleName } from '@prisma/client';
import { Router } from 'express';

export class SubjectRoute implements Routes {
  public path = '/subjects';
  public router = Router();
  public controller = new SubjectController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/average-score/:mssv`, AuthMiddleware, this.controller.getAverageScore);
    this.router.get(
      `${this.path}`,
      validate({
        type: QueryDto,
        typeInput: 'query',
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.getAllSubjects,
    );
    this.router.get(`${this.path}/:id`, AuthMiddleware, roles([RoleName.ADMIN]), this.controller.getSubjectById);
    this.router.post(
      `${this.path}`,
      validate({ typeInput: 'body', type: CreateDto }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.createSubject,
    );
    this.router.patch(
      `${this.path}/:id`,
      validate({ typeInput: 'body', type: UpdateDto }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.updateSubject,
    );
    this.router.delete(`${this.path}/:id`, AuthMiddleware, roles([RoleName.ADMIN]), this.controller.deleteSubject);
  }
}

import { ClassController } from '@/controllers';
import { CreateDto, DeleteDto, ExportDto, QueryDto, UpdateDto } from '@/dtos/classes';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware, validate } from '@/middlewares';
import { roles } from '@/middlewares/roles.middleware';
import { RoleName } from '@prisma/client';
import { Router } from 'express';

export class ClassRoute implements Routes {
  public path = '/classes';
  public router = Router();
  public controller = new ClassController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/export`,
      validate({
        type: ExportDto,
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.exportClasses,
    );
    this.router.get(
      `${this.path}`,
      validate({
        type: QueryDto,
        typeInput: 'query',
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.getAllClasses,
    );
    this.router.get(`${this.path}/:id`, AuthMiddleware, roles([RoleName.ADMIN]), this.controller.getClassById);
    this.router.post(
      `${this.path}`,
      validate({
        type: CreateDto,
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.createClass,
    );
    this.router.patch(
      `${this.path}/:id`,
      validate({
        type: UpdateDto,
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.updateClass,
    );
    this.router.delete(`${this.path}/:id`, AuthMiddleware, roles([RoleName.ADMIN]), this.controller.deleteClass);
    this.router.delete(
      `${this.path}`,
      validate({
        type: DeleteDto,
      }),
      this.controller.deleteClasses,
    );
  }
}

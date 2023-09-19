import { ClassController } from '@/controllers';
import { CreateDto, DeleteDto, ExportDto, QueryDto, UpdateDto } from '@/dtos/classes';
import { Routes } from '@/interfaces/routes.interface';
import { validate } from '@/middlewares';
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
      this.controller.exportClasses,
    );
    this.router.get(
      `${this.path}`,
      validate({
        type: QueryDto,
        typeInput: 'query',
      }),
      this.controller.getAllClasses,
    );
    this.router.get(`${this.path}/:id`, this.controller.getClassById);
    this.router.post(
      `${this.path}`,
      validate({
        type: CreateDto,
      }),
      this.controller.createClass,
    );
    this.router.patch(
      `${this.path}/:id`,
      validate({
        type: UpdateDto,
      }),
      this.controller.updateClass,
    );
    this.router.delete(`${this.path}/:id`, this.controller.deleteClass);
    this.router.delete(
      `${this.path}`,
      validate({
        type: DeleteDto,
      }),
      this.controller.deleteClasses,
    );
  }
}

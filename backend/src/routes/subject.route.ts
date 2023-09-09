import { SubjectController } from '@/controllers';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/subjects';
import { Routes } from '@/interfaces/routes.interface';
import { validate } from '@/middlewares';
import { Router } from 'express';

export class SubjectRoute implements Routes {
  public path = '/subjects';
  public router = Router();
  public controller = new SubjectController();

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
      this.controller.getAllSubjects,
    );
    this.router.get(`${this.path}/:id`, this.controller.getSubjectById);
    this.router.post(`${this.path}`, validate({ typeInput: 'body', type: CreateDto }), this.controller.createSubject);
    this.router.put(`${this.path}/:id`, validate({ typeInput: 'body', type: UpdateDto }), this.controller.updateSubject);
    this.router.delete(`${this.path}/:id`, this.controller.deleteSubject);
  }
}

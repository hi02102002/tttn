import { RolesController } from '@/controllers';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/roles';
import { Routes } from '@/interfaces/routes.interface';
import { validate } from '@/middlewares';
import { Router } from 'express';
export class RoleRoute implements Routes {
  path = '/roles';

  router = Router();

  controller = new RolesController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      this.path,
      validate({
        type: QueryDto,
        typeInput: 'query',
      }),
      this.controller.getAllRoles,
    );

    this.router.post(
      this.path,
      validate({
        type: CreateDto,
      }),
      this.controller.createRole,
    );

    this.router.patch(
      `${this.path}/:id`,
      validate({
        type: UpdateDto,
      }),
      this.controller.updateRole,
    );
    this.router.delete(`${this.path}/:id`, this.controller.deleteRole);
  }
}

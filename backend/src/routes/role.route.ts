import { RolesController } from '@/controllers';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/roles';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware, validate } from '@/middlewares';
import { roles } from '@/middlewares/roles.middleware';
import { RoleName } from '@prisma/client';
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
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.getAllRoles,
    );

    this.router.post(
      this.path,
      validate({
        type: CreateDto,
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.createRole,
    );

    this.router.patch(
      `${this.path}/:id`,
      validate({
        type: UpdateDto,
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.updateRole,
    );
    this.router.delete(
      `${this.path}/:id`,

      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.deleteRole,
    );
  }
}

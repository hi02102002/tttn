import { UserController } from '@/controllers';
import { AdminUpdatePassDto, ChangePassDto, QueryDto, UpdateUserDto } from '@/dtos/users';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware, validate } from '@/middlewares';
import { roles } from '@/middlewares/roles.middleware';
import { upload } from '@/utils/upload';
import { RoleName } from '@prisma/client';
import { Router } from 'express';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/change-password`,
      AuthMiddleware,
      validate({
        type: ChangePassDto,
      }),
      this.controller.changePassword,
    );

    this.router.post(`${this.path}/update-profile`, AuthMiddleware, this.controller.updateProfile);

    this.router.post(`${this.path}/change-avatar`, AuthMiddleware, upload.single('avatar'), this.controller.uploadAvatar);

    this.router.post(
      `${this.path}/update-password/:id`,
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      validate({
        type: AdminUpdatePassDto,
      }),
      this.controller.updatePassword,
    );

    this.router.get(
      this.path,
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      validate({
        type: QueryDto,
        typeInput: 'query',
      }),
      this.controller.getAllUsers,
    );

    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      validate({
        type: UpdateUserDto,
      }),
      this.controller.updateUser,
    );
  }
}

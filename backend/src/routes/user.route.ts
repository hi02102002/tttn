import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import { UserController } from '@/controllers';
import { AuthMiddleware } from '@/middlewares';
import { upload } from '@/utils/upload';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/change-password`, AuthMiddleware, this.controller.changePassword);
    this.router.post(`${this.path}/update-profile`, AuthMiddleware, this.controller.updateProfile);
    this.router.post(`${this.path}/change-avatar`, AuthMiddleware, upload.single('avatar'), this.controller.uploadAvatar);
  }
}

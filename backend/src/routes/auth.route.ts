import { AuthController } from '@/controllers';
import { LoginDto, RegisterDto } from '@/dtos/auth';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware, validate } from '@/middlewares';
import { Router } from 'express';

export class AuthRote implements Routes {
  public path = '/auths';
  public router = Router();
  public controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/login`,
      validate({
        type: LoginDto,
      }),
      this.controller.login,
    );
    this.router.post(
      `${this.path}/register`,
      validate({
        type: RegisterDto,
      }),
      this.controller.register,
    );
    this.router.get(`${this.path}/me`, AuthMiddleware, this.controller.getMe);
  }
}

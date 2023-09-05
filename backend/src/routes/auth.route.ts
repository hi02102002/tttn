import { AuthController } from '@/controllers';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class AuthRote implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.login);
  }
}

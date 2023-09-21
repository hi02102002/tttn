import { ScoreController } from '@/controllers/score.controller';
import { QueryDto, UpdateDto } from '@/dtos/score';
import { Routes } from '@/interfaces/routes.interface';
import { AuthMiddleware, validate } from '@/middlewares';
import { roles } from '@/middlewares/roles.middleware';
import { RoleName } from '@prisma/client';
import { Router } from 'express';

export class ScoreRoute implements Routes {
  public path = '/scores';
  public router = Router();
  public controller = new ScoreController();

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
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.getAllScores,
    );
    this.router.patch(
      `${this.path}`,
      validate({
        type: UpdateDto,
        typeInput: 'body',
      }),
      AuthMiddleware,
      roles([RoleName.ADMIN]),
      this.controller.updateScoreStudent,
    );
  }
}

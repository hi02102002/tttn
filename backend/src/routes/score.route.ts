import { ScoreController } from '@/controllers/score.controller';
import { QueryDto, UpdateDto } from '@/dtos/score';
import { Routes } from '@/interfaces/routes.interface';
import { validate } from '@/middlewares';
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
      this.controller.getAllScores,
    );
    this.router.patch(
      `${this.path}`,
      validate({
        type: UpdateDto,
        typeInput: 'body',
      }),
      this.controller.updateScoreStudent,
    );
  }
}

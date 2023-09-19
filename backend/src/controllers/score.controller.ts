import { ScoreService } from '@/services';
import { catchAsync } from '@/utils/catch-async';
import Container from 'typedi';

export class ScoreController {
  private readonly scoreService = Container.get(ScoreService);

  public getAllScores = catchAsync(async (req, res) => {
    const data = await this.scoreService.getAllScores(req.query as any);
    res.status(200).json({
      message: 'Get all scores successfully',
      data: data,
    });
  });

  public updateScoreStudent = catchAsync(async (req, res) => {
    const data = await this.scoreService.updateScoreStudent(req.body);
    res.status(200).json({
      message: 'Update student score successfully',
      data: data,
    });
  });
}

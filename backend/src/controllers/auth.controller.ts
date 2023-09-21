import { TRequestWithUser } from '@/interfaces/common.type';
import { AuthService } from '@/services';
import { catchAsync } from '@/utils/catch-async';
import { StatusCodes } from 'http-status-codes';

import { Container } from 'typedi';

export class AuthController {
  private readonly authService = Container.get(AuthService);

  public login = catchAsync(async (req, res) => {
    const data = await this.authService.login(req.body);

    res.status(StatusCodes.OK).json({
      message: 'Login successfully',
      data,
    });
  });

  public register = catchAsync(async (req, res) => {
    const data = await this.authService.register(req.body);

    res.status(StatusCodes.CREATED).json({
      message: 'Register successfully',
      data,
    });
  });

  public getMe = catchAsync(async (req: TRequestWithUser, res) => {
    const data = await this.authService.getMe(req.user.id);

    res.status(StatusCodes.OK).json({
      message: 'Get me successfully',
      data,
    });
  });
}

import { QueryDto } from '@/dtos/users';
import { TRequestWithUser, TUser } from '@/interfaces/common.type';
import { UserService } from '@/services';
import { catchAsync } from '@/utils/catch-async';
import Container from 'typedi';

export class UserController {
  private readonly userService = Container.get(UserService);

  public uploadAvatar = catchAsync(async (req: TRequestWithUser, res) => {
    const userId = req.user.id;

    const avatar = await this.userService.uploadAvatar(userId, req.file);

    res.status(200).json({
      message: 'Upload avatar successfully',
      data: {
        avatar,
      },
    });
  });

  public changePassword = catchAsync(async (req: TRequestWithUser, res) => {
    const userId = req.user.id as string;

    await this.userService.changePassword(userId, req.body);

    res.status(200).json({
      message: 'Change password successfully',
      data: null,
    });
  });

  public updateProfile = catchAsync(async (req: TRequestWithUser, res) => {
    const data = await this.userService.updateProfile(req.user as TUser, req.body);

    res.status(200).json({
      message: 'Update profile successfully',
      data,
    });
  });

  public updatePassword = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const data = await this.userService.adminUpdatePassword(userId, req.body);

    res.status(200).json({
      message: 'Update password successfully',
      data,
    });
  });

  public getAllUsers = catchAsync(async (req: TRequestWithUser, res) => {
    const data = await this.userService.getAllUsers(req.user.id, req.query as unknown as QueryDto);

    res.status(200).json({
      message: 'Get all users successfully',
      data,
    });
  });

  public updateUser = catchAsync(async (req, res) => {
    const data = await this.userService.updateUser(req.params.id, req.body);

    res.status(200).json({
      message: 'Update user successfully',
      data,
    });
  });
}

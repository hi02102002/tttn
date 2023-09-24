import { TRequestWithUser } from '@/interfaces/common.type';
import { UserService } from '@/services';
import { catchAsync } from '@/utils/catch-async';

export class UserController {
  constructor(private readonly userService: UserService) {}

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
}

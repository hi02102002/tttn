import { AuthService } from '@/services';
import { catchAsync } from '@/utils/catch-async';

import { Container } from 'typedi';

export class AuthController {
  private readonly authService = Container.get(AuthService);

  public login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await this.authService.login(email, password);
    res.status(200).json({ user, token });
  });
}

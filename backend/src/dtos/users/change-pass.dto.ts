import { Match } from '@/utils/match';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePassDto {
  @IsString()
  @IsNotEmpty({
    message: 'Old password is required',
  })
  oldPassword: string;
  @IsString()
  @IsNotEmpty({
    message: 'New password is required',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty({
    message: 'Confirm password is required',
  })
  @Match('newPassword', {
    message: "Confirm password don't match",
  })
  confirmPassword: string;
}

import { Match } from '@/utils/match';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminUpdatePassDto {
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

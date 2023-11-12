import { Match } from '@/utils/match';
import { OnlyTextNumber } from '@/utils/only-text-number';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({
    message: 'Username is required',
  })
  @OnlyTextNumber()
  username: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;

  @IsString()
  @IsNotEmpty({
    message: 'Confirm password is required',
  })
  @Match('password', {
    message: "Confirm password don't match",
  })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}

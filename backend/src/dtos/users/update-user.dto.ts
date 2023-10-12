import { UserStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  @IsEnum(UserStatus)
  status: UserStatus;
}

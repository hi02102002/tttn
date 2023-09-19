import { RoleName } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsOptional()
  @IsEnum(RoleName)
  name: RoleName;
}

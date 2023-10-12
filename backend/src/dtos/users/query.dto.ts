import { Prisma, UserStatus } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '../shared';

export class QueryDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  @IsEnum(UserStatus, {
    message: `Status must be in ${Object.values(UserStatus).join(', ')}`,
  })
  status: UserStatus;

  @IsObject()
  @IsOptional()
  orderBy: {
    fullname: Prisma.SortOrder;
    username: Prisma.SortOrder;
  };
}

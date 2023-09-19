import { IsObject, IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '../shared';
import { Prisma, RoleName } from '@prisma/client';

export class QueryDto extends QueryPaginationDto {
  @IsOptional()
  @IsString()
  name: RoleName;

  @IsOptional()
  @IsObject()
  orderBy: {
    name: Prisma.SortOrder;
  };
}

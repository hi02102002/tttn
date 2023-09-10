import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '../shared';

export class QueryDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsOptional()
  studentId: string;

  @IsObject()
  @IsOptional()
  orderBy: {
    name: Prisma.SortOrder;
    numCredits: Prisma.SortOrder;
    scores: Prisma.SortOrder;
  };
}

import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { toNumber } from 'lodash';
import { QueryPaginationDto } from '../shared';

export class QueryDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  academicYear: number;

  @IsObject()
  @IsOptional()
  orderBy: {
    name: Prisma.SortOrder;
    students: Prisma.StudentOrderByRelationAggregateInput;
    academicYear: Prisma.SortOrder;
  };
}

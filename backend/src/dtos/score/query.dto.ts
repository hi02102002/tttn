import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '../shared';

export class QueryDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  mssv: string;

  @IsString()
  @IsOptional()
  subjectId: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  studentName: string;

  @IsString()
  @IsOptional()
  classId: string;

  @IsObject()
  @IsOptional()
  orderBy: {
    mssv: Prisma.SortOrder;
    student: Prisma.StudentOrderByWithRelationInput;
    subject: Prisma.SubjectOrderByWithRelationInput;
    class: Prisma.ClassOrderByWithRelationInput;
    score: Prisma.SortOrder;
  };
}

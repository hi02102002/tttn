import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '../shared';

export class QueryDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsOptional()
  classId: string;
}

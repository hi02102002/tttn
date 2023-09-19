import { IsOptional, IsString } from 'class-validator';

export class ExportDto {
  @IsString()
  @IsOptional()
  classId: string;
}

import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ExportDto {
  @IsString()
  @IsOptional()
  classId: string;

  @IsString()
  @IsOptional()
  @IsEnum(['xlsx', 'pdf'], {
    message: 'Type must be either "xlsx" or "pdf"',
  })
  type: 'xlsx' | 'pdf';
}

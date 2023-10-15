import { IsEnum, IsString } from 'class-validator';

export class ExportDto {
  @IsString()
  mssv: string;

  @IsString()
  @IsEnum(['xlsx', 'pdf'], {
    message: 'type must be one of these values: xlsx, pdf',
  })
  type: 'xlsx' | 'pdf';
}

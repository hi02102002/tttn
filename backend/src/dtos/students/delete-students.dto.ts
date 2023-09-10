import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class DeleteStudentsDto {
  @IsArray()
  @IsString({
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'Please provide at least one MSSV',
  })
  mssv: string[];
}

import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddSubjectsDto {
  @IsString()
  @IsNotEmpty({
    message: 'MSSV is required',
  })
  mssv: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Subjects must be at least 1 item',
  })
  @IsString({
    each: true,
  })
  subjectIds: string[];
}

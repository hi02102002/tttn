import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AddSubjectsStudentDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, {
    message: 'Subjects must have at least 1 element',
  })
  subjects: string[];
}

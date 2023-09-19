import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { toNumber } from 'lodash';

export class UpdateDto {
  @IsString()
  @IsNotEmpty({
    message: 'MSSV of student is required',
  })
  mssv: string;

  @IsString()
  @IsNotEmpty({
    message: 'Subject ID is required',
  })
  subjectId: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'Score is required',
  })
  @Transform(({ value }) => toNumber(value))
  score: number;
}

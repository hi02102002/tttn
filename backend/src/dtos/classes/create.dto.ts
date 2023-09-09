import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'Academic year is required',
  })
  @Transform(({ value }) => parseInt(value))
  academicYear: number;
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty({
    message: 'Subject name is required',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'Number of credits is required',
  })
  numCredits: number;
}

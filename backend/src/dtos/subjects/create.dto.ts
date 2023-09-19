import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

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
  @Min(1, {
    message: 'Number of credits at least one credit',
  })
  numCredits: number;
}

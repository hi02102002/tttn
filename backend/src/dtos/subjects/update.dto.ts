import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1, {
    message: 'Number of credits at least one credit',
  })
  numCredits: number;
}

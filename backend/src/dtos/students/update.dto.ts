import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsNotEmpty({
    message: 'Student class id is required',
  })
  classId: string;
}

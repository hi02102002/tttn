import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty({
    message: 'Student name is required',
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: 'Student address is required',
  })
  address: string;

  @IsString()
  @IsNotEmpty({
    message: 'Student class id is required',
  })
  classId: string;
}

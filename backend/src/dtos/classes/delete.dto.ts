import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class DeleteDto {
  @IsArray()
  @IsString({
    each: true,
    message: 'Each id must be a string',
  })
  @ArrayMinSize(1, {
    message: 'You must provide at least one id',
  })
  ids: string[];
}

import { RoleName } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty({
    message: 'Role is required',
  })
  @IsEnum(RoleName, {
    message(validationArguments) {
      const role = validationArguments.constraints
        .map((v: Record<keyof typeof RoleName, string>) => {
          const keys = Object.keys(v)
            .map(v => v)
            .join(' or ');
          return keys;
        })
        .join('');

      return `Role only accept value ${role}`;
    },
  })
  name: RoleName;
}

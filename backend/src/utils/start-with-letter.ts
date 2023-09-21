import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'startsWithLetter', async: false })
class StartsWithLetterConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // Use a regular expression to check if the string starts with a letter
    return /^[a-zA-Z]/.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} should start with a letter.`;
  }
}

export function StartsWithLetter(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: StartsWithLetterConstraint,
    });
  };
}

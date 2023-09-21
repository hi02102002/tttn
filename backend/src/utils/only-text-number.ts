import { ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: '', async: false })
class VOnlyTextNumber implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // Use a regular expression to check if the string contains only letters and numbers
    return /^[a-zA-Z0-9]+$/.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} should not contain spaces or special characters.`;
  }
}

export function OnlyTextNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: VOnlyTextNumber,
    });
  };
}

import { HttpException } from '@/exceptions';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */

type TOptions = {
  type: any;
  typeInput?: 'body' | 'query';
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
};

export const validate = ({ type, typeInput = 'body', skipMissingProperties = false, whitelist = true, forbidNonWhitelisted = true }: TOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req[typeInput]);
    console.log({ dto });
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        req[typeInput] = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(StatusCodes.BAD_REQUEST, message));
      });
  };
};

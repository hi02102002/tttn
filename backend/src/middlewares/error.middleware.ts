import { HttpException } from '@/exceptions';
import { TRequestWithLocale } from '@/interfaces/common.type';
import { logger } from '@/utils/logger';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const ErrorMiddleware = (error: HttpException, req: TRequestWithLocale, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

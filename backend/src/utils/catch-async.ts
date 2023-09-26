import { RequestHandler } from 'express';
import * as core from 'express-serve-static-core';

export type TCatchAsync = <P = core.ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = core.Query>(
  callback: (...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>) => Promise<void>,
) => RequestHandler<P, ResBody, ReqBody, ReqQuery>;

export const catchAsync: TCatchAsync = callback => async (req, res, next) => {
  try {
    return await callback(req, res, next);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

import { JWT_ACCESS_SECRET_KEY } from '@/configs';
import { HttpException } from '@/exceptions';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'jsonwebtoken';

import { TDataStoredInToken, TRequestWithUser } from '@/interfaces/common.type';
import { Request } from 'express';
import { db } from '@/db/prisma';

const getAuthorization = (req: Request) => {
  const coockie = req.cookies['accessToken'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: TRequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = (await verify(Authorization, JWT_ACCESS_SECRET_KEY)) as TDataStoredInToken;

      const user = await db.user.findUnique({
        where: { id: id },
        include: {
          usersRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (user) {
        req.user = user;
        next();
      } else {
        next(new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(StatusCodes.UNAUTHORIZED, 'Token missing. Please login again'));
    }
  } catch (error) {
    next(new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
  }
};

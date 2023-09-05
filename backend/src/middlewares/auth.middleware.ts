// import { SECRET_KEY } from '@/configs';
// import { HttpException } from '@/exceptions';
// import { PrismaClient } from '@prisma/client';
// import { NextFunction, Response } from 'express';
// import { StatusCodes } from 'http-status-codes';
// import { verify } from 'jsonwebtoken';

import { Request } from 'express';

const getAuthorization = (req: Request) => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

// export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
//   try {
//     const Authorization = getAuthorization(req);

//     if (Authorization) {
//       const { id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
//       const users = new PrismaClient().user;
//       const findUser = await users.findUnique({ where: { id: Number(id) } });

//       if (findUser) {
//         req.user = findUser;
//         next();
//       } else {
//         next(new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
//       }
//     } else {
//       next(new HttpException(StatusCodes.NOT_FOUND, 'Authentication token missing'));
//     }
//   } catch (error) {
//     next(new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
//   }
// };

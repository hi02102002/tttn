import { Response, NextFunction } from 'express';
import { TRequestWithUser, TUser } from '@/interfaces/common.type';
import { RoleName } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

export const roles = (roles: RoleName[]) => (req: TRequestWithUser, res: Response, next: NextFunction) => {
  try {
    const user = req.user as TUser;

    const isHasRole = user.usersRoles.some(ur => {
      return roles.includes(ur.role.name);
    });

    if (!isHasRole) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

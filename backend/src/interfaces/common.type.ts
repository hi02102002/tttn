import { Role, RoleName, User, UserRole } from '@prisma/client';
import { Request } from 'express';
export type ESort = 'asc' | 'desc';

export type TUserRole = {
  role: Role;
} & UserRole;

export type TUser = User & {
  usersRoles: TUserRole[];
};

export type TRequestWithUser = {
  user: TUser | User;
} & Request;

export type TDataStoredInToken = {
  id: string;
  roles: RoleName[];
};

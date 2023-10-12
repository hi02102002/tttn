import { Locales, TranslationFunctions } from '@/i18n/i18n-types';
import { Role, RoleName, User, UserRole } from '@prisma/client';
import { Request } from 'express';
export type ESort = 'asc' | 'desc';

export type TUserRole = {
  role: Role;
} & UserRole;

export type TUser = User & {
  usersRoles: TUserRole[];
};

export type TRequestWithLocale = {
  locale: Locales;
  translate: TranslationFunctions;
} & Request;

export type TRequestWithUser = {
  user: TUser | User;
} & TRequestWithLocale;

export type TDataStoredInToken = {
  id: string;
  roles: RoleName[];
};

import { TOderBy, TQueryPagination } from './shared';

export enum RoleName {
   STUDENT = 'STUDENT',
   ADMIN = 'ADMIN',
}

export type TRole = {
   id: string;
   name: RoleName;
};

export type TRoleDto = Pick<TRole, 'name'>;

export type TRoleQuery = TQueryPagination &
   Partial<Pick<TRole, 'name'>> &
   TOderBy;

import { RoleName } from './role';
import { TOderBy, TQueryPagination } from './shared';
import { TStudent } from './student';

export enum EStatus {
   ACTIVE = 'ACTIVE',
   BLOCKED = 'BLOCKED',
}

export type TAvatar = {
   id: string;
   name: string;
   url: string;
   userId: string;
};

export type TRole = {
   id: string;
   name: RoleName;
};

export type TUserRole = {
   id: string;
   userId: string;
   roleId: string;
   role: TRole;
};

export type TUser = {
   id: string;
   username: string;
   usersRoles: TUserRole[];
   avatar: TAvatar;
   student?: TStudent | null;
   fullName: string;
   status: EStatus;
};

export type TUpdateProfileDto = {
   address?: string;
};

export type TQueryUser = {
   fullName?: string;
   username?: string;
   status?: EStatus;
} & TQueryPagination &
   TOderBy;

export type TUpdateUserDto = {
   fullName?: string;
   username?: string;
   status?: EStatus;
};

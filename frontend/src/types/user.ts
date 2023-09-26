import { RoleName } from './role';
import { TStudent } from './student';

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
};

export type TUpdateProfileDto = {
   address?: string;
};

export enum ERole {
   ADMIN = 'ADMIN',
   STUDENT = 'STUDENT',
}

export type TRole = {
   id: string;
   name: ERole;
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
};

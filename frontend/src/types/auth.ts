export type TLoginDto = {
   username: string;
   password: string;
};

export type TRegisterDto = {
   username: string;
   password: string;
   confirmPassword: string;
};

export type TChangePasswordDto = {
   oldPassword: string;
   newPassword: string;
   confirmPassword: string;
};

import { httpClient } from '@/lib/axios';
import { TChangePasswordDto } from '@/types/auth';
import { TBaseResponse, TBaseService } from '@/types/shared';
import {
   TQueryUser,
   TUpdateProfileDto,
   TUpdateUserDto,
   TUser,
} from '@/types/user';

class UsersService implements TBaseService {
   public endpoint = '/users';

   changePassword(data: TChangePasswordDto): Promise<TBaseResponse<null>> {
      return httpClient.post(`${this.endpoint}/change-password`, data);
   }

   updateProfile(data: TUpdateProfileDto): Promise<TBaseResponse<null>> {
      return httpClient.post(`${this.endpoint}/update-profile`, data);
   }

   async changeAvatar(
      file: File | Blob | string
   ): Promise<TBaseResponse<null>> {
      if (typeof file === 'string') {
         const res = await fetch(file);

         const contentType = res.headers.get('Content-Type') as string;
         const blob = await res.blob();

         file = new File([blob], 'avatar', { type: contentType });
      }

      const formData = new FormData();
      formData.append('avatar', file);
      return httpClient.post(`${this.endpoint}/change-avatar`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
   }

   adminUpdatePassword(
      userId: string,
      data: Omit<TChangePasswordDto, 'oldPassword'>
   ): Promise<TBaseResponse<null>> {
      return httpClient.post(
         `${this.endpoint}/update-password/${userId}`,
         data
      );
   }
   getAllUsers(q?: TQueryUser): Promise<
      TBaseResponse<{
         total: number;
         users: TUser[];
      }>
   > {
      return httpClient.get(this.endpoint, {
         params: q,
      });
   }

   updateUser(
      userId: string,
      data: TUpdateUserDto
   ): Promise<TBaseResponse<TUser>> {
      return httpClient.patch(`${this.endpoint}/${userId}`, data);
   }
}

export const usersService = new UsersService();

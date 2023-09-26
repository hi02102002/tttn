import { httpClient } from '@/lib/axios';
import { TChangePasswordDto } from '@/types/auth';
import { TBaseResponse, TBaseService } from '@/types/shared';
import { TUpdateProfileDto } from '@/types/user';

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
}

export const usersService = new UsersService();

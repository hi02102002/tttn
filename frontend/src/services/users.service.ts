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
}

export const usersService = new UsersService();

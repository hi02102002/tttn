import { ENDPOINTS } from '@/constants';
import { httpClient } from '@/lib/axios';
import { TLoginDto } from '@/types/auth';
import { TBaseResponse, TBaseService } from '@/types/shared';
import { TUser } from '@/types/user';
import axios from 'axios';

class AuthService implements TBaseService {
   endpoint: string = ENDPOINTS.AUTH;
   async login(data: TLoginDto): Promise<
      TBaseResponse<{
         accessToken: string;
         refreshToken: string;
      }>
   > {
      const res = await axios.post(`/api/${this.endpoint}/login`, data);
      return res.data;
   }

   getMe(): Promise<TBaseResponse<TUser>> {
      return httpClient.get(`${this.endpoint}/me`);
   }

   logout(): Promise<TBaseResponse<any>> {
      return axios.post(`/api/${this.endpoint}/logout`).then((res) => res.data);
   }
}

export const authService = new AuthService();

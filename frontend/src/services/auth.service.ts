import { ENDPOINTS } from '@/constants';
import { httpClient } from '@/lib/axios';
import { TLoginDto } from '@/types/auth';
import { TBaseResponse, TBaseService } from '@/types/shared';
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

   async getMe(): Promise<TBaseResponse<any>> {
      return httpClient.get(`${this.endpoint}/me`);
   }
}

export const authService = new AuthService();

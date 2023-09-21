import { TBaseResponse } from '@/types/shared';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';
import { API_URL } from '@/constants';
export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   try {
      if (req.method === 'POST') {
         const { username, password } = req.body;

         const _res = await axios.post<
            TBaseResponse<{
               accessToken: string;
               refreshToken: string;
            }>
         >(`${API_URL}/auths/login`, {
            username,
            password,
         });

         const data = _res.data;

         setCookie('accessToken', data.data.accessToken, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 23 * 1, // 23 hours
            req,
            res,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' ? true : false,
         });

         setCookie('refreshToken', data.data.refreshToken, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 23 * 7, // 6 days 23 hours,
            req,
            res,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' ? true : false,
         });

         res.status(200).json({
            message: _res.data.message,
            data: _res.data.data,
         });
      } else {
         res.status(405).json({
            message: 'Method not allowed',
            data: null,
         });
      }
   } catch (error: any) {
      res.status(error?.response.status || 500).json({
         message: error?.response?.data?.message || 'Something went wrong',
         data: null,
      });
   }
}

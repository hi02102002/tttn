import { API_URL } from '@/constants';
import { TBaseResponse } from '@/types/shared';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   const locale = req.cookies['locale'] || 'en';
   try {
      if (req.method === 'POST') {
         const { username, password } = req.body;

         const _res = await axios.post<
            TBaseResponse<{
               accessToken: string;
               refreshToken: string;
            }>
         >(
            `${API_URL}/auths/login`,
            {
               username,
               password,
            },
            {
               headers: {
                  locale,
               },
            }
         );

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

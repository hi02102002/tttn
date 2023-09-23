import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   try {
      if (req.method === 'POST') {
         deleteCookie('accessToken', {
            req,
            res,
         });

         res.status(200).json({
            message: 'Logout successfully',
            data: null,
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

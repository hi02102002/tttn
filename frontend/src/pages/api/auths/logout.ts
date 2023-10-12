import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   const locale = req.cookies['locale'] || 'en';

   try {
      if (req.method === 'POST') {
         deleteCookie('accessToken', {
            req,
            res,
         });

         res.status(200).json({
            message:
               locale === 'en' ? 'Logout successfully' : 'Đăng xuất thành công',
            data: null,
         });
      } else {
         res.status(405).json({
            message:
               locale === 'en'
                  ? 'Method not allowed'
                  : 'Phương thức không được phép',
            data: null,
         });
      }
   } catch (error: any) {
      res.status(error?.response.status || 500).json({
         message:
            error?.response?.data?.message || locale === 'en'
               ? 'Internal server error'
               : 'Lỗi máy chủ nội bộ',
         data: null,
      });
   }
}

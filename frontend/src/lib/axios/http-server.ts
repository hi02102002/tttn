import { API_URL } from '@/constants';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

const http_server = (ctx: GetServerSidePropsContext) => {
   const token = getCookie('accessToken', {
      req: ctx.req,
      res: ctx.res,
   });

   const lang = getCookie('lang', {
      req: ctx.req,
      res: ctx.res,
   });

   const instance = axios.create({
      baseURL: API_URL,
      headers: {
         'Content-type': 'application/json',
         Authorization: `Bearer ${token}`,
         locale: lang,
      },
   });

   instance.interceptors.request.use(
      function (config) {
         return config;
      },
      function (error) {
         return Promise.reject(error);
      }
   );

   instance.interceptors.response.use(
      function (response) {
         return response.data;
      },
      function (error) {
         return Promise.reject(error);
      }
   );

   return instance.get;
};

export default http_server;

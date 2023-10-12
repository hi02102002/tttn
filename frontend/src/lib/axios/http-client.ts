import { API_URL } from '@/constants';
import axios from 'axios';
import { getCookie } from 'cookies-next';
const httpClient = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-type': 'application/json',
   },
   withCredentials: true,
});

httpClient.interceptors.request.use(
   function (config) {
      const accessToken = getCookie('accessToken');
      const lang = getCookie('lang') || 'en';

      if (accessToken) {
         config.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      if (lang) {
         config.headers['locale'] = lang;
      }

      return config;
   },
   function (error) {
      return Promise.reject(error);
   }
);

// Add a response interceptor
httpClient.interceptors.response.use(
   function (response) {
      return response.data;
   },
   async function (error) {
      return Promise.reject(error);
   }
);

export { httpClient };

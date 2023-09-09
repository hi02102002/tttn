import axios from 'axios';

const httpServer = axios.create({
   baseURL: 'http://localhost:5000',
   headers: {
      'Content-type': 'application/json',
   },
});

httpServer.interceptors.request.use(
   function (config) {
      return config;
   },
   function (error) {
      return Promise.reject(error);
   }
);

httpServer.interceptors.response.use(
   function (response) {
      return response.data;
   },
   function (error) {
      return Promise.reject(error);
   }
);

export { httpServer };

import axios from 'axios';
const httpClient = axios.create({
   baseURL: 'http://localhost:5000',
   headers: {
      'Content-type': 'application/json',
   },
});

httpClient.interceptors.request.use(
   function (config) {
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
   function (error) {
      return Promise.reject(error);
   }
);

export { httpClient };

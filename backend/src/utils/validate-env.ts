import { cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    JWT_ACCESS_SECRET_KEY: str(),
    JWT_REFRESH_SECRET_KEY: str(),
  });
};

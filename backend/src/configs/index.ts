import { config } from 'dotenv';
config({ path: '.env' });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, JWT_ACCESS_SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, JWT_REFRESH_SECRET_KEY } = process.env;

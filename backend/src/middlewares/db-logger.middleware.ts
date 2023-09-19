import { db } from '@/db/prisma';
import { logger } from '@/utils/logger';

export const dbLogger = () => {
  db.$use(async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();

    logger.info(`Query ${params.model}.${params.action} took ${after - before}ms`);

    return result;
  });
};

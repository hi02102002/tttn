import { db } from '@/db/prisma';

export const subjectSoftDelete = () => {
  db.$use(async (params, next) => {
    if (params.model === 'Subject') {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = {
          deletedAt: new Date(),
        };
      }

      if (params.action == 'deleteMany') {
        // Delete many queries
        params.action = 'updateMany';
        if (params.args.data !== undefined) {
          params.args.data['deletedAt'] = new Date();
        } else {
          params.args['data'] = { deletedAt: new Date() };
        }
      }
    }
    return next(params);
  });
};

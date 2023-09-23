import { pagination } from '@/utils/pagination';
import { db } from '@/db/prisma';
import { CreateDto, QueryDto, UpdateDto } from '@/dtos/roles';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions';
import { StatusCodes } from 'http-status-codes';

@Service()
export class RolesService {
  async createRole(data: CreateDto) {
    try {
      const role = await db.role.create({
        data,
      });

      return role;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new HttpException(StatusCodes.CONFLICT, 'Role with name already exist');
      }

      throw error;
    }
  }

  async getAllRoles(q?: QueryDto) {
    const { name, page, limit } = q || {};
    const [roles, total] = await db.$transaction([
      db.role.findMany({
        where: {
          name,
        },
        ...pagination(page, limit),
      }),
      db.role.count({
        where: {
          name,
        },
      }),
    ]);
    return {
      roles,
      total,
    };
  }

  async updateRole(id: string, data: UpdateDto) {
    try {
      const role = await db.role.findUnique({
        where: {
          id,
        },
      });

      if (!role) {
        throw new HttpException(StatusCodes.NOT_FOUND, 'Role not found');
      }

      const updated = await db.role.update({
        where: {
          id,
        },
        data: {
          name: data.name,
        },
      });

      return updated;
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new HttpException(StatusCodes.CONFLICT, 'Role with name already exist');
      }

      throw error;
    }
  }

  async deleteRole(id: string) {
    try {
      await db.role.delete({
        where: {
          id,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2003') {
        throw new HttpException(StatusCodes.BAD_REQUEST, "Can't delete this role. Because it using by users");
      }

      throw error;
    }
  }

  async seedRoles() {
    await db.role.createMany({
      data: [
        {
          name: 'STUDENT',
        },
        {
          name: 'ADMIN',
        },
      ],
      skipDuplicates: true,
    });
  }
}

import { db } from '@/db/prisma';
import { AdminUpdatePassDto, ChangePassDto, QueryDto, UpdateProfileDto, UpdateUserDto } from '@/dtos/users';
import { HttpException } from '@/exceptions';
import { TUser } from '@/interfaces/common.type';
import { Prisma, RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';
import { Service } from 'typedi';
import { pagination } from './../utils/pagination';
import { FileService } from './file.service';

@Service()
export class UserService {
  constructor(private readonly fileService: FileService) {}

  async getAllUsers(currentUser: string, query?: QueryDto) {
    const { fullName, username, orderBy, page, limit } = query || {};

    const where: Prisma.UserWhereInput = {
      OR: [
        {
          fullName: {
            contains: fullName,
          },
        },
        {
          username: {
            contains: username,
          },
        },
      ],
      id: {
        not: currentUser,
      },
    };

    const [users, total] = await db.$transaction([
      db.user.findMany({
        where,
        orderBy: orderBy
          ? {
              fullName: orderBy.fullname,
              username: orderBy.username,
            }
          : undefined,
        ...pagination(page, limit),
        select: {
          id: true,
          fullName: true,
          username: true,
          status: true,
          usersRoles: {
            select: {
              role: true,
            },
          },
        },
      }),
      db.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
    };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, `User with this id not found`);
    }

    const avatar = await this.fileService.uploadAvatar(userId, file);

    return avatar;
  }

  async getUserById(id: string) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async changePassword(userId: string, body: ChangePassDto) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, `User with this id not found`);
    }

    const isMatch = await bcrypt.compare(body.oldPassword, user.password);

    if (!isMatch) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Your password is incorrect`);
    }

    const newPassword = await bcrypt.hash(body.newPassword, 10);

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      },
    });
  }

  async updateProfile(_user: TUser, body: UpdateProfileDto) {
    const isStudent = _user.usersRoles.some(ur => ur.role.name === RoleName.STUDENT);

    if (!isStudent) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `You are not a student`);
    }

    const student = await db.student.findUnique({
      where: {
        mssv: _user.studentId,
      },
    });

    if (!student) {
      throw new HttpException(StatusCodes.NOT_FOUND, `Student with this id not found`);
    }

    const updatedStudent = await db.user.update({
      where: {
        id: _user.studentId,
      },
      data: {
        student: {
          update: {
            address: body.address,
          },
        },
      },
      include: {
        student: true,
      },
    });

    return omit(updatedStudent, ['password']);
  }

  async adminUpdatePassword(userId: string, body: AdminUpdatePassDto) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, `User with this id not found`);
    }

    const newPassword = await bcrypt.hash(body.newPassword, 10);

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      },
    });
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, `User with this id not found`);
    }

    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        fullName: true,
        username: true,
        status: true,
        usersRoles: {
          select: {
            role: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, `User with this id not found`);
    }

    const student = await db.student.findUnique({
      where: {
        mssv: user.studentId,
      },
    });

    if (student) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `This user is a student`);
    }

    await db.user.delete({
      where: {
        id: userId,
      },
    });
  }
}

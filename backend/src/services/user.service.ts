import { Service } from 'typedi';
import { FileService } from './file.service';
import { HttpException } from '@/exceptions';
import { db } from '@/db/prisma';
import { StatusCodes } from 'http-status-codes';
import { ChangePassDto, UpdateProfileDto } from '@/dtos/users';
import * as bcrypt from 'bcrypt';
import { TUser } from '@/interfaces/common.type';
import { RoleName } from '@prisma/client';
import { omit } from 'lodash';

@Service()
export class UserService {
  constructor(private readonly fileService: FileService) {}

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, `User with this id not found`);
    }

    const avatar = await this.fileService.createAvatar(userId, file);

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
        userId: _user.id,
      },
    });

    if (!student) {
      throw new HttpException(StatusCodes.NOT_FOUND, `Student with this id not found`);
    }

    const updatedStudent = await db.user.update({
      where: {
        id: _user.id,
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
}

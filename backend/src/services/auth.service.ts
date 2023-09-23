import { db } from '@/db/prisma';
import { LoginDto, RegisterDto } from '@/dtos/auth';
import { HttpException } from '@/exceptions';
import { catchAsync } from '@/utils/catch-async';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { RoleName, User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { TUser } from '@/interfaces/common.type';
import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from '@/configs';

@Service()
export class AuthService {
  public register = async (data: RegisterDto) => {
    try {
      const { username, password } = data;

      const role = await db.role.findUnique({
        where: {
          name: 'STUDENT',
        },
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await db.user.create({
        data: {
          username,
          password: hashedPassword,
          usersRoles: {
            createMany: {
              data: [
                {
                  roleId: role.id,
                },
              ],
            },
          },
          avatar: {
            create: {
              url: `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}`,
              name: `username-${username}`,
            },
          },
        },
        select: {
          username: true,
          id: true,
          usersRoles: {
            include: {
              role: true,
            },
          },
          avatar: true,
        },
      });

      return user;
    } catch (error: any) {
      console.log(error);
      if (error?.code === 'P2002') {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'Username already exists');
      }

      throw error;
    }
  };

  public login = async (data: LoginDto) => {
    const { username, password } = data;

    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        id: true,
        password: true,
        usersRoles: {
          include: {
            role: true,
          },
        },
        student: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Account with this username does not exists');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Password is incorrect');
    }

    const { accessToken, refreshToken } = this.genKeyPair(user);

    return {
      accessToken,
      refreshToken,
    };
  };

  public generateToken = ({ user, roles, secret, expiresIn }: { user: TUser; roles: RoleName[]; secret: string; expiresIn: string }) => {
    const token = jwt.sign({ id: user.id, roles }, secret, { expiresIn });

    return token;
  };

  public genKeyPair = (user: TUser) => {
    const roles = user.usersRoles.map(userRole => userRole.role.name);
    const accessToken = this.generateToken({
      user,
      roles,
      secret: JWT_ACCESS_SECRET_KEY,
      expiresIn: '1d',
    });

    const refreshToken = this.generateToken({
      user,
      roles,
      secret: JWT_REFRESH_SECRET_KEY,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  };

  async getMe(id: string) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        usersRoles: {
          include: {
            role: true,
          },
        },
        avatar: true,
        student: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }

    return omit(user, ['password']);
  }
}

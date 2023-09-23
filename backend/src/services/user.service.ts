import { Service } from 'typedi';
import { FileService } from './file.service';
import { HttpException } from '@/exceptions';
import { db } from '@/db/prisma';
import { StatusCodes } from 'http-status-codes';

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
}

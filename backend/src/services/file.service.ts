import { Service } from 'typedi';
import { FirebaseService } from './firebase.service';
import { db } from '@/db/prisma';
import * as fs from 'fs';
@Service()
export class FileService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileUrl = await this.firebaseService.uploadFile(file);

    return fileUrl;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    try {
      const _file = await db.file.findUnique({
        where: {
          userId,
        },
      });

      if (_file) {
        await this.firebaseService.deleteFile(_file.url);
      }

      const fileUrl = await this.firebaseService.uploadFile(file);

      const avatar = await db.file.update({
        where: {
          userId,
        },
        data: {
          url: fileUrl,
          userId,
          name: file.originalname,
        },
      });

      fs.unlinkSync(file.path);
      return avatar;
    } catch (error) {
      fs.unlinkSync(file.path);
      throw error;
    }
  }

  async deleteFile(fileId: string) {
    const file = await db.file.delete({
      where: {
        id: fileId,
      },
    });

    await this.firebaseService.deleteFile(file.url);

    return file;
  }
}

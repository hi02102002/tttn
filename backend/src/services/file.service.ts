import { Service } from 'typedi';
import { FirebaseService } from './firebase.service';
import { db } from '@/db/prisma';

@Service()
export class FileService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileUrl = await this.firebaseService.uploadFile(file);

    return fileUrl;
  }

  async createAvatar(userId: string, file: Express.Multer.File) {
    const fileUrl = await this.firebaseService.uploadFile(file);

    const avatar = await db.file.create({
      data: {
        url: fileUrl,
        userId,
        name: file.originalname,
      },
    });

    return avatar;
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

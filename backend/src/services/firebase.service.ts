import { Service } from 'typedi';
import * as firebase from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import cert from '@cert.json';
import * as mime from 'mime-types';
import { Bucket } from '@google-cloud/storage';

const STORAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/tttn-1614e.appspot.com/o/';

@Service()
export class FirebaseService {
  private admin: firebase.app.App;
  private bucket: Bucket;

  constructor() {
    const _admin = firebase.initializeApp({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      credential: firebase.credential.cert(cert),
      storageBucket: 'tttn-1614e.appspot.com',
    });

    this.admin = _admin;

    this.bucket = _admin.storage().bucket();
  }

  async uploadFile(file: Express.Multer.File) {
    const token = uuid();
    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
      contentType: mime.lookup(file.path),
      cacheControl: 'public, max-age=31536000',
    };

    const res = await this.bucket.upload(file.path, {
      metadata,
    });

    const url = `${STORAGE_URL}${res[0].name}?alt=media&token=${token}`;

    return url;
  }

  async deleteFile(url: string) {
    const imagePath: string = this.getPathStorageFromUrl(url);

    await this.bucket.file(imagePath).delete();
  }

  private getPathStorageFromUrl(url: String) {
    let imagePath: string = url.replace(STORAGE_URL, '');

    const indexOfEndPath = imagePath.indexOf('?');

    imagePath = imagePath.substring(0, indexOfEndPath);

    imagePath = imagePath.replace(/%2F/g, '/');

    imagePath = imagePath.replace(/%20/g, ' ');

    return imagePath;
  }
}

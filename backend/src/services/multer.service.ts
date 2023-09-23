import { Service } from 'typedi';
import multer from 'multer';
import * as fs from 'fs';

@Service()
export class MulterService {
  public upload: multer.Multer;

  constructor() {
    this.upload = this.configMulter();
  }

  private configMulter() {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const path = 'uploads';

        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }

        cb(null, path);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
      },
    });

    return multer({ storage: storage });
  }
}

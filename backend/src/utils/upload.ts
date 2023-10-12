import multer from 'multer';
import * as fs from 'fs';
import * as mime from 'mime-types';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = './uploads';

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    cb(null, path);
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + '-' + uniqueSuffix + '.' + ext;
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });

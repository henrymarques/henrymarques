import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const folder = path.resolve(__dirname, '..', '..', 'temp');

export default {
  uploadDir: folder,
  storage: multer.diskStorage({
    destination: folder,
    filename(request, file, callback) {
      const filehash = crypto.randomBytes(10).toString('HEX');
      const filename = `${filehash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};

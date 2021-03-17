import fs from 'fs';
import path from 'path';

import upload from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorage implements IStorageProvider {
  public async save(filename: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(upload.tempFolder, filename),
      path.resolve(upload.uploadsFolder, filename),
    );

    return filename;
  }

  public async delete(filename: string): Promise<void> {
    const filepath = path.resolve(upload.uploadsFolder, filename);

    try {
      await fs.promises.stat(filepath);
    } catch {
      return;
    }
    await fs.promises.unlink(filepath);
  }
}

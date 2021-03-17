import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorage implements IStorageProvider {
  private storage: string[] = [];

  public async save(filename: string): Promise<string> {
    this.storage.push(filename);

    return filename;
  }

  public async delete(filename: string): Promise<void> {
    const fileIndex = this.storage.findIndex(file => file === filename);
    this.storage.splice(fileIndex, 1);
  }
}

import IMailProvider from '../models/IMailProvider';
import ISendMessageDTO from '../dtos/ISendMessageDTO';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendMessageDTO[] = [];

  public async send(message: ISendMessageDTO): Promise<void> {
    this.messages.push(message);
  }
}

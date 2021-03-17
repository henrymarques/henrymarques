import ISendMessageDTO from '../dtos/ISendMessageDTO';

export default interface IMailProvider {
  send(data: ISendMessageDTO): Promise<void>;
}

import path from 'path';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
export default class ForgotPasswordService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('MailProvider')
    private mailProvier: IMailProvider,
    @inject('TokenRepository')
    private tokenRepository: IUserTokenRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new AppError('O endereço de e-mail não está em uso');
    }

    const { token } = await this.tokenRepository.generate(user.id);
    const mailTemplate = path.resolve(
      __dirname,
      '..',
      'templates',
      'forgot_password.hbs',
    );

    await this.mailProvier.send({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'GoBarber - Recuperação de senha',
      templateData: {
        templateFile: mailTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset?t=${token}`,
        },
      },
    });
  }
}

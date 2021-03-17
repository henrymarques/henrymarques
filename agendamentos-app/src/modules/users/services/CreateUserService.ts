import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userExists = await this.repository.findByEmail(email);

    if (userExists) {
      throw new AppError('E-mail is in use');
    }

    const password_hash = await this.hashProvider.generate(password);

    const newUser = await this.repository.create({
      name,
      email,
      password: password_hash,
    });

    return newUser;
  }
}

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  email: string;
  name: string;
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    email,
    name,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.repository.findById(user_id);

    if (!user) {
      throw new AppError('You are not authenticated', 401);
    }

    const userExists = await this.repository.findByEmail(email);

    if (userExists && user_id !== userExists.id) {
      throw new AppError('E-mail already in use');
    }

    if (password && !old_password) {
      throw new AppError('Wrong old password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compare(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Wrong old password');
      }

      user.password = await this.hashProvider.generate(password);
    }

    user.name = name;
    user.email = email;

    return this.repository.save(user);
  }
}

import { getRepository, Repository } from 'typeorm';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';

import UserToken from '../entities/UserToken';

export default class UserTokenRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const foundToken = await this.ormRepository.findOne({ where: { token } });
    return foundToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const token = this.ormRepository.create({ user_id });
    await this.ormRepository.save(token);

    return token;
  }
}

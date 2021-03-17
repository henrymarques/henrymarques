import { uuid } from 'uuidv4';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokenRepository from '../IUserTokenRepository';

export default class UserRepository implements IUserTokenRepository {
  private tokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const token = new UserToken();

    Object.assign(token, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.tokens.push(token);

    return token;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.tokens.find(item => item.token === token);

    return userToken;
  }
}

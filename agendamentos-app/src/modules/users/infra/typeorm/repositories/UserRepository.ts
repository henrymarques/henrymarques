import { getRepository, Repository, Not } from 'typeorm';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAllProviders(except_id?: string): Promise<User[]> {
    if (except_id) {
      const users = await this.ormRepository.find({
        where: {
          id: Not(except_id),
        },
      });
      return users;
    }

    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne(id);
    return foundUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.ormRepository.findOne({ where: { email } });
    return foundUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);
    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UserRepository;

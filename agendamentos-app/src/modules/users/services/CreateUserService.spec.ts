import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeRepository, fakeHashProvider);
  });

  it('should be able to create a user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user with existing e-mail', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'email@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

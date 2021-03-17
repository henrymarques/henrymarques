import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserService from './UpdateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;
let fakeRepository: FakeUserRepository;
let updateUser: UpdateUserService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUser = new UpdateUserService(fakeRepository, fakeHashProvider);
  });

  it('should update yourself', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: 'Carlos Jonathan',
      email: 'carlos@jonathan.com',
    });

    expect(updatedUser.name).toBe('Carlos Jonathan');
    expect(updatedUser.email).toBe('carlos@jonathan.com');
  });

  it('should not update the e-mail to an already existing one', async () => {
    await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    const user = await fakeRepository.create({
      name: 'Carlos Jonathan',
      email: 'carlos@jonathan.com',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'Carlos Jonathan',
        email: 'email@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update the password', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123123',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: 'Carlos Jonathan',
      email: 'carlos@jonathan.com',
      old_password: '123123',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not update the password without old password', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'Carlos Jonathan',
        email: 'carlos@jonathan.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not update the password with wrong old password', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'Carlos Jonathan',
        email: 'carlos@jonathan.com',
        old_password: '123321',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existing user', async () => {
    await expect(
      updateUser.execute({
        user_id: 'non-existing-user',
        name: 'Carlos Jonathan',
        email: 'carlos@jonathan.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

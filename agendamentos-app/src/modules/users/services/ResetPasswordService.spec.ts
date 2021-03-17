import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from './ResetPasswordService';

let fakeRepository: FakeUserRepository;
let tokenRepository: FakeUserTokenRepository;
let hashProvider: FakeHashProvider;

let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeRepository = new FakeUserRepository();
    tokenRepository = new FakeUserTokenRepository();
    hashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeRepository,
      tokenRepository,
      hashProvider,
    );
  });

  it('reset the password', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    const { token } = await tokenRepository.generate(user.id);

    const generateFn = jest.spyOn(hashProvider, 'generate');

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeRepository.findById(user.id);

    expect(generateFn).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('not reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('not reset the password with non-existing user', async () => {
    const { token } = await tokenRepository.generate('ne-user-id');

    await expect(
      resetPassword.execute({
        token,
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('not reset the password if passed more than 2 hours', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    const { token } = await tokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

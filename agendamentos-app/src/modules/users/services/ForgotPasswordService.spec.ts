import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

import ForgotPasswordService from './ForgotPasswordService';

let fakeRepository: FakeUserRepository;
let tokenRepository: FakeUserTokenRepository;

let mailProvider: FakeMailProvider;
let forgotPassword: ForgotPasswordService;

describe('ForgotPassword', () => {
  beforeEach(() => {
    fakeRepository = new FakeUserRepository();
    tokenRepository = new FakeUserTokenRepository();

    mailProvider = new FakeMailProvider();
    forgotPassword = new ForgotPasswordService(
      fakeRepository,
      mailProvider,
      tokenRepository,
    );
  });

  it('recover password using e-mail', async () => {
    const sendFn = jest.spyOn(mailProvider, 'send');

    await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    await forgotPassword.execute({
      email: 'email@test.com',
    });

    expect(sendFn).toBeCalled();
  });

  it('recover a non-existing user password', async () => {
    await expect(
      forgotPassword.execute({
        email: 'email@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('generate forgot password token', async () => {
    const generateFn = jest.spyOn(tokenRepository, 'generate');

    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    await forgotPassword.execute({
      email: 'email@test.com',
    });

    expect(generateFn).toBeCalledWith(user.id);
  });
});

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeStorage: FakeStorageProvider;
let fakeRepository: FakeUserRepository;
let updateAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeStorage = new FakeStorageProvider();
    fakeRepository = new FakeUserRepository();
    updateAvatar = new UpdateUserAvatarService(fakeRepository, fakeStorage);
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update a non-existing user avatar', async () => {
    await expect(
      updateAvatar.execute({
        user_id: '123',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete user avatar when update', async () => {
    const deleteFn = jest.spyOn(fakeStorage, 'delete');

    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.png',
    });

    expect(deleteFn).toHaveBeenCalledWith('avatar.png');
  });
});

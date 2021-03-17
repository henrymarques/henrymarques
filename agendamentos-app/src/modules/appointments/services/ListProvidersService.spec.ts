import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let fakeRepository: FakeUserRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeRepository = new FakeUserRepository();
    listProviders = new ListProvidersService(fakeRepository);
  });

  it('should be able to show user profile yourself', async () => {
    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@test.com',
      password: '123456',
    });

    const users = await listProviders.execute({ user_id: user.id });

    expect(users).toHaveProperty('id');
  });
});

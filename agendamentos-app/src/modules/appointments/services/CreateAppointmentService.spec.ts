import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeRepository);
  });

  it('should be able to create an appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      user_id: '123',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointment in same date', async () => {
    const date = new Date();
    await createAppointment.execute({
      date,
      user_id: '123',
    });

    await expect(
      createAppointment.execute({
        date,
        user_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

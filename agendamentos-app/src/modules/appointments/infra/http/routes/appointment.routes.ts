import { Router } from 'express';

import verifyAuthenticaction from '@modules/users/infra/http/middlewares/verifyAuthentication';
import AppointmentController from '../controllers/AppointmentController';

const router = Router();
const appointmentController = new AppointmentController();

router.use(verifyAuthenticaction);

/* router.get('/', async (request, response) => {
  const appointmentRepository = getCustomRepository(AppointmentRepository);
  return response.json(await appointmentRepository.find());
}); */

router.post('/', appointmentController.create);

export default router;

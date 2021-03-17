import { Router } from 'express';

import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

import ProfileController from '../controllers/ProfileControler';

const router = Router();

const profileController = new ProfileController();

router.use(verifyAuthentication);
router.get('', profileController.show);
router.put('/', profileController.update);

export default router;

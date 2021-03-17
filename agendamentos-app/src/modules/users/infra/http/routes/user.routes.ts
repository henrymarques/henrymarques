import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

import UserController from '../controllers/UserController';
import AvatarController from '../controllers/AvatarController';

const router = Router();
const upload = multer(uploadConfig);

const userController = new UserController();
const avatarController = new AvatarController();

router.post('/', userController.create);

router.patch(
  '/avatar',
  verifyAuthentication,
  upload.single('avatar'),
  avatarController.update,
);

export default router;

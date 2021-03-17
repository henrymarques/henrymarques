import { Router } from 'express';

import appointmentRouter from '@modules/appointments/infra/http/routes/appointment.routes';
import userRouter from '@modules/users/infra/http/routes/user.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionRouter from '@modules/users/infra/http/routes/session.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/appointment', appointmentRouter);
routes.use('/user', userRouter);
routes.use('/profile', profileRouter);
routes.use('/session', sessionRouter);
routes.use('/password', passwordRouter);

export default routes;

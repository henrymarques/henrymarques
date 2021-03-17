/* eslint-disable no-console */
import 'reflect-metadata';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use((ex: Error, request: Request, response: Response, _: NextFunction) => {
  if (ex instanceof AppError) {
    response.status(ex.statusCode).json({ status: 'error', error: ex.message });
  }

  console.log(ex);

  return response.status(500).json({
    status: 'error',
    message: 'Unexpected server error',
  });
});

app.listen(3333, () => {
  console.log('server started on port 3333');
});

import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import Bcrypt from './HashProvider/implementations/Bcrypt';

container.registerSingleton<IHashProvider>('HashProvider', Bcrypt);

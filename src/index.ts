import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import { connectDB } from './config/database';
import { initSwagger } from './config/swagger';
import { logger } from './helpers/default.logger';
import { initRoute } from './config/route';

const PORT = 8000;
const corsOptions = {
  optionsSuccessStatus: 200
};

const initServer = async () => {
  const app = express();
  const router: Express = express();

  /** CORS */
  app.use(cors(corsOptions));
  app.use(helmet());
  /** Logging */
  router.use(morgan('dev'));
  /** Parse the request */
  router.use(express.urlencoded({ extended: false }));
  /** Takes care of JSON data */
  router.use(express.json());

  // await connectDB();
  initSwagger(app);
  initRoute(app);

  app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`);
  });
};

initServer();

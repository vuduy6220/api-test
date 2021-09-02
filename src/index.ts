import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import { initSwagger } from './config/swagger';
import { logger } from './helpers/default.logger';
import testRoute from './api/v1/test/test.controller';

const PORT = 8080;
const corsOptions = {
  optionsSuccessStatus: 200
};

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

initSwagger(app);
app.use('/v1', testRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('not found');
  return res.status(400).json({
    message: error.message,
  });
});

app.listen(PORT, () => {
  logger.info(`Server is running on PORT ${PORT}`);
});

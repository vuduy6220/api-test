import { createConnection, ConnectionOptions, DatabaseType } from 'typeorm';

import { logger } from 'src/helpers/default.logger';
import { User } from 'src/models';

const databaseConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'learning',
  database: process.env.POSTGRES_DB || 'api-ts',
  entities: [User],
  synchronize: true,
};

export const connectDB = async () => {
  await createConnection(databaseConfig)
    .then(() => {
      logger.info('Connect database success');
    })
    .catch((error) => {
      logger.error('Connect database error', error);
      process.exit(1);
    });
};

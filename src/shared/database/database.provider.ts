import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pg from 'pg';
import { EnvVariable } from '../config/config.validation';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export type DatabaseConnection = pg.Pool;

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<pg.Pool> => {
      const logger = new Logger(DATABASE_CONNECTION);

      const pgPool = new pg.Pool({
        host: configService.get(EnvVariable.PGHOST as string),
        database: configService.get(EnvVariable.POSTGRES_DB as string),
        user: configService.get(EnvVariable.PGUSER as string),
        password: configService.get(EnvVariable.PGPASSWORD as string),
        port: parseInt(configService.get(EnvVariable.PGPORT), 10),
      });

      try {
        await pgPool.connect();
      } catch (err) {
        logger.error('Failed to connect to PostgreSQL:', err.message);
        process.exit(1);
      }

      return pgPool;
    },
  },
];

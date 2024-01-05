import * as Joi from 'joi';

export const configValidations = Joi.object().keys({
  PORT: Joi.number().default(3000),

  PGHOST: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGPORT: Joi.string().required(),
  PGUSER: Joi.string().required(),
});

export enum EnvVariable {
  PORT = 'PORT',

  PGHOST = 'PGHOST',
  PGPASSWORD = 'PGPASSWORD',
  PGPORT = 'PGPORT',
  PGUSER = 'PGUSER',
  POSTGRES_DB = 'POSTGRES_DB',
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configOptions from './config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from './exception_filter/globalException.filter';

@Module({
  imports: [ConfigModule.forRoot(configOptions)],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
  exports: [ConfigService],
})
export class AppConfigModule {}

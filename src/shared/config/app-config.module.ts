import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configOptions from './config';

@Module({
  imports: [ConfigModule.forRoot(configOptions)],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {}

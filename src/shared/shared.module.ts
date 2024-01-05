import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/app-config.module';
import { GlobalExceptionsFilter } from './exception_filter/globalException.filter';

@Global()
@Module({
  imports: [AppConfigModule, DatabaseModule],
  providers: [GlobalExceptionsFilter],
  exports: [DatabaseModule, GlobalExceptionsFilter],
})
export class SharedModule {}

import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/app-config.module';

@Global()
@Module({
  imports: [AppConfigModule, DatabaseModule],
  providers: [],
  exports: [DatabaseModule],
})
export class SharedModule {}

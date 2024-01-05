import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './invoice/invoice.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [InvoiceModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repo';
import { DatabaseModule } from 'src/shared/database/database.module';
import { UtilService } from 'src/shared/utils/util.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository, UtilService],
})
export class InvoiceModule {}

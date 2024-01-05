import { InvoiceItem } from '../entity/invoice-item.entity';
import { Invoice } from '../entity/invoice.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetInvoiceDetails {
  @ApiProperty({})
  @Type(() => Invoice)
  invoice: Invoice;

  @ApiProperty({})
  @Type(() => InvoiceItem)
  items: InvoiceItem[];
}

import { CommonResponse } from 'src/shared/utils/dtos/common-response';
import { InvoiceItem } from '../entity/invoice-item.entity';
import { Invoice } from '../entity/invoice.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateInvoiceDto extends Invoice {
  @ApiProperty()
  @Type(() => InvoiceItem)
  items: InvoiceItem[];
}

//Response data transfer object
export class UpdateInvoiceResponse extends CommonResponse {
  @ApiProperty()
  @Type(() => UpdateInvoiceDto)
  data: UpdateInvoiceDto[];
}

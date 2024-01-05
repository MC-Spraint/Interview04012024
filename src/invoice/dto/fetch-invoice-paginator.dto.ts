import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Paginator } from '../../shared/utils/pagination/paginator';
import { UpdateInvoiceDto } from './update-invoice.dto';
import { CommonResponse } from 'src/shared/utils/dtos/common-response';

export class FetchInvoicePaginator extends Paginator {
  @ApiProperty({})
  @Type(() => UpdateInvoiceDto)
  data: UpdateInvoiceDto[];
}

//Response data transfer object
export class FetchInvoicePaginatorResponse extends CommonResponse {
  @ApiProperty()
  @Type(() => FetchInvoicePaginator)
  data: FetchInvoicePaginator[];
}

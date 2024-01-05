import { ApiProperty } from '@nestjs/swagger';

export class InvoiceItem {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  item_name: string;

  @ApiProperty({})
  item_quantity: number;

  @ApiProperty({})
  item_rate: number;

  @ApiProperty({})
  item_amount: number;

  @ApiProperty({})
  item_discount_percentage: number;

  @ApiProperty({})
  item_discount_amount: number;

  @ApiProperty({})
  invoice_id: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CommonResponse } from 'src/shared/utils/dtos/common-response';

export class SummaryDto {
  @ApiProperty({})
  date: string;

  @ApiProperty({})
  invoice_count: number;

  @ApiProperty({})
  item_count: number;

  @ApiProperty({})
  total_discount_value: number;

  @ApiProperty({})
  total_amount: number;
}

//Response data transfer object
export class SummaryResponse extends CommonResponse {
  @ApiProperty()
  @Type(() => SummaryDto)
  data: SummaryDto[];
}

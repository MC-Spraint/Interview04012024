import { ApiProperty } from '@nestjs/swagger';

export class Invoice {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  client_name: string;

  @ApiProperty({})
  total_amount: number;

  @ApiProperty({})
  date: Date;
}

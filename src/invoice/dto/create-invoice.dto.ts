import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonResponse } from 'src/shared/utils/dtos/common-response';

//Request data transfer object
export class CreateInvoiceDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @ApiProperty({})
  @IsDate()
  @IsNotEmpty()
  date: Date;
}
//Response data transfer object
export class CreateInvoiceResponse extends CommonResponse {
  @ApiProperty({})
  @Type(() => CreateInvoiceDto)
  data: CreateInvoiceDto;
}

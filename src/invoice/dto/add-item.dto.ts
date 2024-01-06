import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonResponse } from 'src/shared/utils/dtos/common-response';

//Request data transfer object
export class AddItemDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  item_name: string;

  @ApiProperty({})
  @IsNumber()
  @IsNotEmpty()
  item_quantity: number;

  @ApiProperty({})
  @IsNumber()
  @IsNotEmpty()
  item_rate: number;

  @ApiProperty({})
  @IsNumber()
  @IsNotEmpty()
  item_discount_percentage: number;

  @ApiProperty({})
  @IsString()
  @IsUUID()
  @IsOptional()
  invoice_id: string;
}
//Response data transfer object
export class AddItemResponse extends CommonResponse {
  @ApiProperty({})
  @Type(() => AddItemDto)
  data: AddItemDto;
}

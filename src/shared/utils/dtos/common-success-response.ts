import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from 'src/shared/utils/dtos/common-response';

export class commonSuccessResponse<T> extends CommonResponse {
  @ApiProperty({})
  data: T | null;
}

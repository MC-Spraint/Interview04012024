import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from './error-response.enum';
import { SuccessResponseCode } from './success-response-code.enum';
import { SuccessResponse } from './success-response.enum';

export class CommonResponse {
  @ApiProperty({})
  status: string;

  @ApiProperty({})
  response_code: SuccessResponseCode;

  @ApiProperty({})
  response: SuccessResponse | ErrorResponse;

  @ApiProperty({})
  message: string;
}

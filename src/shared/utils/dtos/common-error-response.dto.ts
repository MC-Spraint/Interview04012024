import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class CommonErrorResponseDto extends ErrorResponseDto {
  @ApiProperty()
  data: string | null;
}

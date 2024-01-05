import { SuccessResponseCode } from './success-response-code.enum';
import { SuccessResponse } from './success-response.enum';

export const BookingStatuskMap = new Map<SuccessResponse, SuccessResponseCode>([
  [SuccessResponse.OK, SuccessResponseCode.OK],
  [SuccessResponse.CREATED, SuccessResponseCode.CREATED],
  [SuccessResponse.ACCEPTED, SuccessResponseCode.ACCEPTED],
  [SuccessResponse.NO_CONTENT, SuccessResponseCode.NO_CONTENT],
]);

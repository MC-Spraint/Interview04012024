import { Injectable } from '@nestjs/common';
import { ResponseType } from './dtos/response-type.enum';
import { SuccessResponseCode } from './dtos/success-response-code.enum';
import { SuccessResponse } from './dtos/success-response.enum';
import { BookingStatuskMap } from './dtos/success-response.map';
import { commonSuccessResponse } from './dtos/common-success-response';
import { IPaginator } from './pagination/IPaginator';

@Injectable()
export class UtilService {
  private response<T>(
    status: string,
    responseCode: number,
    response: SuccessResponse,
    message: string,
    data: T,
    extra?: IPaginator,
  ): commonSuccessResponse<T> {
    if (!extra) {
      return {
        status: status,
        response_code: responseCode,
        response: response,
        message: message,
        data: data,
      };
    } else {
      return {
        status: status,
        response_code: responseCode,
        response: response,
        message: message,
        ...extra,
        data: data,
      };
    }
  }
  private customSuccessResponse<T>(
    responseCode: SuccessResponseCode,
    response: SuccessResponse,
    message: string,
    data: T,
    extra?: IPaginator,
  ): commonSuccessResponse<T> {
    if (!extra) {
      return this.response<T>(
        ResponseType.SUCCESS,
        responseCode,
        response,
        message,
        data,
      );
    } else {
      const res = this.response<T>(
        ResponseType.SUCCESS,
        responseCode,
        response,
        message,
        data,
        extra,
      );
      return res;
    }
  }
  public successResponseOk<T>(
    message: string,
    data: T,
    extra?: IPaginator,
  ): commonSuccessResponse<T> {
    if (!extra) {
      return this.customSuccessResponse<T>(
        SuccessResponseCode.OK,
        SuccessResponse.OK,
        message,
        data,
      );
    } else {
      const res = this.customSuccessResponse<T>(
        SuccessResponseCode.OK,
        SuccessResponse.OK,
        message,
        data,
        extra,
      );
      return res;
    }
  }
  public successResponseCreated<T>(
    message: string,
    data: T,
    extra?: IPaginator,
  ): commonSuccessResponse<T> {
    if (!extra) {
      return this.customSuccessResponse<T>(
        SuccessResponseCode.CREATED,
        SuccessResponse.CREATED,
        message,
        data,
      );
    } else {
      const res = this.customSuccessResponse<T>(
        SuccessResponseCode.CREATED,
        SuccessResponse.CREATED,
        message,
        data,
        extra,
      );
      return res;
    }
  }
}

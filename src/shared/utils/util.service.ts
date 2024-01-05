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
  public successResponse<T>(
    sucRes: SuccessResponse,
    message: string,
    data: T,
    extra?: IPaginator,
  ): commonSuccessResponse<T> {
    return this.customSuccessResponse<T>(
      BookingStatuskMap.get(sucRes) as SuccessResponseCode,
      sucRes,
      message,
      data,
      extra,
    );
  }
  //Existing = E, transformed = T
  public filter<E>(arr: E[], condition: (element: E) => boolean): E[] {
    if (arr.length == 0) return [];
    const [head, ...tail] = arr;
    if (condition(head)) return [head, ...this.filter(tail, condition)];
    return this.filter(tail, condition);
  }
  public map<E, T>(arr: E[], condition: (element: E) => T): T[] {
    if (arr.length == 0) return [];
    const [head, ...tail] = arr;
    return [condition(head), ...this.map(tail, condition)];
  }
  public some<E>(arr: E[], condition: (element: E) => boolean): boolean {
    if (arr.length == 0) return false;
    const [head, ...tail] = arr;
    if (condition(head)) return true;
    return this.some(tail, condition);
  }
  public every<E>(arr: E[], condition: (element: E) => boolean): boolean {
    if (arr.length == 0) return true;
    const [head, ...tail] = arr;
    if (condition(head)) return this.every(tail, condition);
    return false;
  }
}

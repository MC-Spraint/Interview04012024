import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { ResponseType } from '../../utils/dtos/response-type.enum';
import { CustomHttpExceptionResponse } from './interfaces/ICustomHttpExceptionResponse';
import { HttpExceptionResponse } from './interfaces/IHttpExceptionResponse';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ): Response<unknown, Record<string, unknown>> {
    let status: HttpStatus;
    const error_name: string = exception.name;
    let message: string;
    let errorMessage: string;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      // Handle Http exception
      status = exception.getStatus();
      message = exception['message'];
      const errorResponse = exception.getResponse();
      errorMessage =
        (errorResponse as HttpExceptionResponse).error || exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception['message'];
      errorMessage = 'CRITICAL_INTERNAL_SERVER_ERROR';
    }

    const errorResponse = this.getErrorResponse(
      status,
      error_name,
      errorMessage,
      message,
      request,
    );
    const errorLog = this.logError(errorResponse, request, exception); //First log the exception
    this.writeErrorLogToFile(errorLog); // Log the errors in a file

    return response.status(status).json(errorResponse); // Second display the exception
  }
  private getErrorResponse(
    status_code: HttpStatus,
    error_name: string,
    errorMessage: string,
    message: string,
    request: Request,
  ): CustomHttpExceptionResponse<null> {
    return {
      status: ResponseType.ERROR,
      response_code: status_code,
      response: errorMessage,
      error: errorMessage,
      name: error_name,
      message: message,
      data: null,
      path: request.url,
      method: request.method,
      timestamp: new Date(),
    };
  }
  private logError(
    errorResponse: CustomHttpExceptionResponse<null>,
    request: Request,
    exception: HttpException,
  ): string {
    const { response_code, error, message } = errorResponse;
    const { method, path } = request;
    const errorLog = `Error: ${error} - Name: ${
      exception.name
    } - Message: ${message}\nStatus code: ${response_code} - Method: ${method} - Path: ${path}\n
                        ${JSON.stringify(errorResponse)}\n
                        ${
                          exception instanceof HttpException
                            ? exception.stack
                            : exception
                        }`;
    this.logger.error(errorLog);
    return errorLog;
  }
  private writeErrorLogToFile(errorLog: string): void {
    fs.appendFile('error.log', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  }
}

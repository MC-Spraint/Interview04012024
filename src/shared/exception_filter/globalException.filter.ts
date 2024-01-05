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
import { ResponseType } from '../utils/dtos/response-type.enum';
import { CustomHttpExceptionResponse } from './interfaces/ICustomHttpExceptionResponse';
import { HttpExceptionResponse } from './interfaces/IHttpExceptionResponse';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    try {
      const { status, error_name, errorMessage, message } =
        this.handleHttpException(exception);

      const errorResponse = this.getErrorResponse(
        status,
        error_name,
        errorMessage,
        message,
        request,
      );

      this.logError(errorResponse, request, exception);
      this.writeErrorLogToFile(errorResponse);

      return response.status(status).json(errorResponse);
    } catch (error) {
      this.logger.error(`Error while processing exception: ${error}`);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: ResponseType.ERROR,
        response_code: HttpStatus.INTERNAL_SERVER_ERROR,
        response: 'Internal Server Error',
        error: 'INTERNAL_SERVER_ERROR',
        name: 'InternalServerError',
        message: 'Internal Server Error',
        data: null,
        path: request.url,
        method: request.method,
        timestamp: new Date(),
      });
    }
  }

  // ...

  private handleHttpException(exception: HttpException) {
    let status: HttpStatus;
    const error_name: string = exception.name;
    let message: string;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      // Handle Http exception
      status = exception.getStatus();
      message = exception.getResponse()?.toString() || 'Internal Server Error';
      const errorResponse = exception.getResponse();
      errorMessage = (errorResponse as HttpExceptionResponse)?.error || message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      errorMessage = 'CRITICAL_INTERNAL_SERVER_ERROR';
    }

    return { status, error_name, errorMessage, message };
  }

  // ...

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
  ): void {
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
  }

  private writeErrorLogToFile(
    errorResponse: CustomHttpExceptionResponse<null>,
  ): void {
    const errorLog = `${JSON.stringify(errorResponse)}\n`;
    fs.appendFile('error.log', errorLog, 'utf8', (err) => {
      if (err) {
        this.logger.error(`Error writing to error.log: ${err}`);
      }
    });
  }
}

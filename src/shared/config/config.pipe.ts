import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

export const VALIDATION_PIPE: ValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (
    validationErrors: ValidationError[],
  ): BadRequestException => {
    const [validationError] = validationErrors;
    const constraints = Object.values(validationError.constraints as object);
    const errorMessage = {
      message: constraints[0] || '',
      statusCode: 400,
      extensions: {
        code: 'validation-error',
      },
    };
    return new BadRequestException(errorMessage);
  },
});

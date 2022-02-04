import { HttpException } from '@nestjs/common';
import { FieldErrorValidation } from '../base/field-error.validation';

export class ValidationException extends HttpException {
  constructor(message: string, fields: FieldErrorValidation[]) {
    super({ message, fields }, 500);
  }
}

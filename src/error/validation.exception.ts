import { BadRequestException } from '@nestjs/common';
import { Errors } from './types';

export class ValidationException extends BadRequestException {
  constructor(public readonly errors: Errors) {
    super('Validation failed');
  }
}

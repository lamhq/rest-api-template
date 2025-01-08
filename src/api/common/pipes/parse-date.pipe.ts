import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Check value is a Date string
 * Return undefined if value is empty
 */
@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date | undefined> {
  transform(value: string): Date | undefined {
    if (value && Number.isNaN(Date.parse(value))) {
      throw new BadRequestException('Invalid Date string');
    }
    return value ? new Date(value) : undefined;
  }
}

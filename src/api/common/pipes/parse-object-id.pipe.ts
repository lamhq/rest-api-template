import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIDPipe implements PipeTransform {
  transform(value: string) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ObjectID');
    }
    return value;
  }
}

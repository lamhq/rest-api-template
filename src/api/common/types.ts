import { ApiProperty } from '@nestjs/swagger';

export interface PaginationQuery {
  offset?: number;
  limit?: number;
}

class Errors {
  [key: string]: string | Errors;
}

export class ErrorResponse {
  @ApiProperty({ example: 'Invalid input' })
  code: string;

  @ApiProperty({ example: 'Invalid input' })
  message: string;

  @ApiProperty({
    example: {
      field1: 'This field is required',
      field2: 'Minimum length is 6',
    },
  })
  errors?: Errors;
}

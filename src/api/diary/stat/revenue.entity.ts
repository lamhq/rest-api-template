import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class Revenue {
  @Expose()
  @ApiProperty()
  income: number;

  @Expose()
  @ApiProperty()
  outcome: number;

  constructor(income: number, outcome: number) {
    this.income = income;
    this.outcome = outcome;
  }
}

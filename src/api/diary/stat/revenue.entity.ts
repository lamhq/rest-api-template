import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

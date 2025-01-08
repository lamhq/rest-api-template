import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class ActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  time: string;

  @ApiProperty()
  tags: string[] = [];

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  income: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  outcome: number;
}

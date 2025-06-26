import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  @IsEmail()
  username: string;

  @ApiProperty({ example: '12345', description: 'Password' })
  @IsString()
  password: string;
}

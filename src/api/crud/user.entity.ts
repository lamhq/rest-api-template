import { IsEmail, IsNotEmpty } from 'class-validator';

export class User {
  id: number;

  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

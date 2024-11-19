import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUSerDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class loginDto {
  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class registerDto {
  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email;
}
import { IsNotEmpty, IsString } from "class-validator";

export class loginDto {
  @IsString()
  @IsNotEmpty()
  account: string;

  @IsString()
  @IsNotEmpty()
  password:string;
}
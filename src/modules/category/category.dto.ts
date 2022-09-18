import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class addCategoryDto {
  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  remark: string;

  @IsString()
  @IsIn(['0', '1'])
  type: string;
}
export class editCategoryDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  remark: string;

}
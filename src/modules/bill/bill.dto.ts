import { IsDefined, IsIn, IsNotEmpty,  IsNumber,  IsString, Length } from "class-validator";

export class addBillDto {

  @IsNumber()
  @IsIn([0, 1])
  type: number;

  // @IsString()
  // @IsNotEmpty()
  // name: string;

  // @IsString()
  @IsDefined()
  @Length(0, 10, { message: 'remark的长度1-10' })
  remark: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  payTime: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  
}
export class editBillDto  extends addBillDto{
  @IsString()
  @IsNotEmpty()
  id: string;

}
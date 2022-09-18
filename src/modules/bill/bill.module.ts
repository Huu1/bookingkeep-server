import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entity/category.entity';
import { User } from '../user/entity/user.entity';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { Bill } from './entity/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill,Category,User])],
  controllers: [BillController],
  providers: [BillService]
})
export class BillModule {}

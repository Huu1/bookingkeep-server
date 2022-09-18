import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType, DateType } from 'src/common/constant';
import { date_Format } from 'src/common/tool/utils';
import { getRepository, Repository } from 'typeorm';
import { Category } from '../category/entity/category.entity';
import { User } from '../user/entity/user.entity';
import { addBillDto, editBillDto } from './bill.dto';
import { Bill } from './entity/bill.entity';

import * as _ from "lodash";

const billHandle= (value ,type)=>_.sumBy(value.filter(i=>Number(i.type)===type),(i)=>+i.amount).toFixed(2);

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  async newBill(data: addBillDto, uid: string) {
    try {
      const user = await this.userRepository.findOne(uid);
      const category = await this.categoryRepository.findOne(data.categoryId);
      const bill = new Bill();
      // bill.name = data.name;
      bill.type = data.type;
      bill.remark = data.remark;
      bill.amount = data.amount;
      bill.payTime = new Date(data.payTime+86400000);

      bill.category = category;
      bill.user = user;

      await this.billRepository.save(bill);
      return {};
    } catch (e) {
      return {
        code: 1,
        msg: e.message,
      };
    }
  }
  async editBill(data: editBillDto, uid: string) {
    try {
      const user = await this.userRepository.findOne(uid);
      const category = await this.categoryRepository.findOne(data.categoryId);
      const bill = await this.billRepository.findOne(data.id, {
        relations: ['user'],
      });
      if (bill?.user.id == uid) {
        // bill.name = data.name;
        bill.type = data.type;
        bill.remark = data.remark;
        bill.payTime = new Date(data.payTime+86400000);

        bill.category = category;
        bill.user = user;
        await this.billRepository.save(bill);

        return {};
      } else {
        return { code: 1, msg: '未找到此账单' };
      }
    } catch (e) {
      return {
        code: 1,
        msg: e.message,
      };
    }
  }
  async delBill(data, uid: string) {
    try {
      const bill = await this.billRepository.findOne(data.id, {
        relations: ['user'],
      });
      if (bill?.user.id == uid) {
        await this.billRepository.remove(bill);
        return {};
      } else {
        return { code: 1, msg: '未找到此账单' };
      }
    } catch (e) {
      return {
        code: 1,
        msg: e.message,
      };
    }
  }
  async getBillStatement(data) {
    const { date, dateType } = data;
    let res;
    try {
      if (Number(dateType) === DateType.月) {
        res = await getRepository(Bill)
          .createQueryBuilder('bill')
          .select('bill.type')
          .addSelect('ROUND(SUM(bill.amount),2)', 'count')
          .groupBy('bill.type')
          .where('DATE_FORMAT(bill.payTime,"%Y-%m") =:date', { date })
          .getRawMany();
      } else {
        res = await getRepository(Bill)
          .createQueryBuilder('bill')
          .select('bill.type')
          .addSelect('ROUND(SUM(bill.amount),2)', 'count')
          .groupBy('bill.type')
          .where('DATE_FORMAT(bill.payTime,"%Y") =:date', { date })
          .getRawMany();
      }
      
      const income =
        res.find(i => i.bill_type == CategoryType.收入)?.count ?? 0;
      const expend =
        res.find(i => i.bill_type == CategoryType.支出)?.count ?? 0;

      const balance = Number(income - expend);

      return {
        data: {
          income:Number(income).toFixed(2),
          expend:Number(expend).toFixed(2),
          balance:Number(balance).toFixed(2),
        },
      };
    } catch (e) {
      return {
        code: 1,
        msg: e.message,
      };
    }
  }
  async getBillList(data) {
    const { date, dateType } = data;
    let result=[];
    let res;
    try {
      if (Number(dateType) === DateType.月) {
        // const dateStr='%m-%d';
        res = await getRepository(Bill)
          .createQueryBuilder('bill')
          .leftJoinAndSelect('bill.category','category')
          .where(`DATE_FORMAT(bill.payTime,"%Y-%m") =:date`, { date })
          .select('bill.amount', 'amount')
          .addSelect('DATE_FORMAT(bill.payTime,"%m-%d")', 'payTime')
          .addSelect('bill.payTime', 'date')
          .addSelect('bill.id', 'id')
          .addSelect('bill.remark', 'remark')
          .addSelect('bill.type', 'type')
          .addSelect('bill.created_at', 'createTime')
          .addSelect('category.name', 'categoryName')
          .addSelect('category.icon', 'categoryIcon')
          .addSelect('category.id', 'categoryId')
          .addSelect('category.isDefault', 'categoryIsDefault')
          .orderBy('bill.payTime','DESC')
          .getRawMany();
      } else if(Number(dateType) === DateType.年) {
        res = await getRepository(Bill)
          .createQueryBuilder('bill')
          .leftJoinAndSelect('bill.category','category')
          .where(`DATE_FORMAT(bill.payTime,"%Y") =:date`, { date })
          .select('bill.amount', 'amount')
          .addSelect('DATE_FORMAT(bill.payTime,"%m")', 'payTime')
          .addSelect('bill.payTime', 'date')
          .addSelect('bill.id', 'id')
          .addSelect('bill.remark', 'remark')
          .addSelect('bill.type', 'type')
          .addSelect('bill.created_at', 'createTime')
          .addSelect('category.name', 'categoryName')
          .addSelect('category.icon', 'categoryIcon')
          .addSelect('category.id', 'categoryId')
          .addSelect('category.isDefault', 'categoryIsDefault')
          .orderBy('bill.payTime','DESC')
          .getRawMany();
      }


      result=_.groupBy(res,'payTime');
      result=_.map( result, (value, key,a) => 
      { 
        const income =billHandle(value,CategoryType.收入);
        const expend =billHandle(value,CategoryType.支出);
        const balance = Number(income - expend);
          return {
            date:key,
            list: value,
            income,
            expend,
            balance:balance?.toFixed(2)
          };
        });
          
      return {
        data:result,
      };
    } catch (e) {
      return {
        code: 1,
        msg: e.message,
      };
    }
  }
}

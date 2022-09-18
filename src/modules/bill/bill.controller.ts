import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { DateType } from 'src/common/constant';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { addBillDto, editBillDto } from './bill.dto';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('new')
  @Roles(Role.User)
  newBill(@Body() data: addBillDto, @Req() { uid }) {
    return this.billService.newBill(data, uid);
  }

  @Post('edit')
  @Roles(Role.User)
  editBill(@Body() data: editBillDto, @Req() { uid }) {
    return this.billService.editBill(data, uid);
  }

  @Post('del')
  @Roles(Role.User)
  delBill(@Body() data: { id: string }, @Req() { uid }) {
    return this.billService.delBill(data, uid);
  }

  @Get('statement')
  @Roles(Role.User)
  getBillStatement(
    @Query() data:{ dateType: DateType; date: string },
  ) {
    return this.billService.getBillStatement(data);
  }

  @Get('list')
  @Roles(Role.User)
  getBillList(
    @Query() data:{ dateType: DateType; date: string },
  ) {
    return this.billService.getBillList(data);
  }
}

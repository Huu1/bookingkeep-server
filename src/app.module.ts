import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { BillModule } from './modules/bill/bill.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'bookingkeep',
      charset: 'utf8', // 设置chatset编码为utf8mb4
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
      timezone: "+8",
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    BillModule
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}

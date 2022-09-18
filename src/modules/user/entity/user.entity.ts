
import { BaseEdntity } from 'src/common/constant/baseEntity';
import { Bill } from 'src/modules/bill/entity/bill.entity';
import { Category } from 'src/modules/category/entity/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEdntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: '' })
  account: string;

  @Column({ default: '' })
  username: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '', select: false })
  password: string;

  @Column({ default: 'chenguanxi.png' })
  avatar: string;

  @Column({ default: 'user' })
  role: string;

  // 1启动 0禁用
  @Column({ default: 1 ,select: false})
  status: number;


  @OneToMany(() => Category, _ => _.user)
  category?: Category[];

  @OneToMany(() => Bill, _ => _.user)
  bill?: Bill[];

}

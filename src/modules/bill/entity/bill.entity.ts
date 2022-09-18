import { CategoryType } from 'src/common/constant';
import { BaseEdntity } from 'src/common/constant/baseEntity';
import { Category } from 'src/modules/category/entity/category.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Bill extends BaseEdntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.支出,
    comment: '类型',
  })
  type: CategoryType;

  @Column({ type: 'decimal',precision: 22, scale: 2,default: 0.00})
  amount: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  payTime: Date;

  @Column({ default: '', comment: '备注' })
  remark: string;

  @ManyToOne(
    () => User,
    user => user.bill,
  )
  user: User | null;

  @ManyToOne(
    () => Category,
    _ => _.user,
  )
  category: Category;
}

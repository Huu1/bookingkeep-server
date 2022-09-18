import { CategoryType, isDefaultType } from 'src/common/constant';
import { BaseEdntity } from 'src/common/constant/baseEntity';
import { User } from 'src/modules/user/entity/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Category extends BaseEdntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '', comment: '名称' })
  name: string;

  @Column({ default: '', comment: '备注' })
  remark: string;

  @Column({ default: '', comment: '类别样式' })
  icon: string;

  @Column({
    type: 'enum',
    enum: isDefaultType,
    default: isDefaultType.用户,
    comment: '是否系统默认',
  })
  isDefault: isDefaultType;

  @Column({
    default: CategoryType.支出,
    comment: '类型',
  })
  type: string;

  @ManyToOne(
    () => User,
    user => user.category,
  )
  user: User | null;
}

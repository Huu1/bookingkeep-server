import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType, isDefaultType } from 'src/common/constant';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { addCategoryDto, editCategoryDto } from './category.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCategory(type: CategoryType) {
    const where = type === undefined ? {} : { type };
    try {
      const res = await this.categoryRepository.find({
        where,
      });
      return {
        data: res,
      };
    } catch (e) {
      return {};
    }
  }

  async addCategory() {
    try {
      const category = new Category();
      const res = await this.categoryRepository
        .createQueryBuilder('')
        .select(
          "location,DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%s') create_time",
        )
        .getRawMany();
      return {
        data: res,
      };
    } catch (e) {
      return {};
    }
  }

  async addDefaultCategory(data: addCategoryDto) {
    try {
      const category = new Category();
      category.name = data.name;
      category.icon = data.icon;
      category.type = data.type;
      category.remark = data.remark;
      category.isDefault = isDefaultType.默认;
      await this.categoryRepository.save(category);
      return {};
    } catch (e) {
      return {};
    }
  }

  async addCustomCategory(data: addCategoryDto, uid: string) {
    try {
      const user = await this.userRepository.findOne(uid);
      const category = new Category();
      category.name = data.name;
      category.icon = data.icon;
      category.type = data.type;
      category.remark = data.remark;
      category.isDefault = isDefaultType.用户;

      category.user = user;

      await this.categoryRepository.save(category);
      return {};
    } catch (e) {
      return {};
    }
  }

  async editCategory(data: editCategoryDto, uid: string) {
    try {
      const category = await this.categoryRepository.findOne(
        {
          id: data.id,
        },
        {
          relations: ['user'],
          where: {
            isDefault: isDefaultType.用户,
          },
        },
      );

      if (category?.user.id == uid) {
        category.name = data.name;
        category.icon = data.icon;
        category.remark = data.remark;
        await this.categoryRepository.save(category);
        return {};
      } else {
        return { code: 1, msg: '未找到', data: category };
      }
    } catch (e) {
      return { code: 1 };
    }
  }
}

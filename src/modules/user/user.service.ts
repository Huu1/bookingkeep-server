import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { nameVerify, passwordVerify } from 'src/common/tool/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(userId: string) {
    try {
      let data;
      if (userId) {
        data = await this.userRepository.findOne({
          where: { userId: userId },
        });
        return { msg: '获取用户成功', data };
      }
    } catch (e) {
      return { code: 404, msg: '获取用户失败', data: e };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { loginDto } from './user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: loginDto): Promise<any> {
    const user = await this.userRepository.findOne(
      {
        account: data.account,
      },
      {
        select: ['password', 'id', 'role'],
      },
    );
    if (!user) {
      return { code: 1, msg: `用户不存在`, data: null };
    }

    if (user.password !== data.password) {
      return { code: 1, msg: `密码错误`, data: null };
    }

    const payload = { userId: user.id, roles: [user.role] };
    return {
      msg: '登录成功',
      data: {
        token: this.jwtService.sign(payload),
      },
    };
  }
}

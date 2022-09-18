import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.Admin)
  getUsers(@Query('uid') uid: string) {
    return this.userService.getUser(uid);
  }

  @Get('currentUser')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.User)
  getUser(@Req() req) {
    return this.userService.getUser(req.uid);
  }
}

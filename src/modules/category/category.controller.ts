import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryType } from 'src/common/constant';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { addCategoryDto, editCategoryDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles(Role.User)
  getCategory(@Query('type') type: CategoryType) {
    return this.categoryService.getCategory(type);
  }

  @Post('default')
  @Roles(Role.Admin)
  addDefaultCategory(@Body() data: addCategoryDto) {
    return this.categoryService.addDefaultCategory(data);
  }

  @Post('custom')
  @Roles(Role.User)
  addCustomCategory(@Body() data: addCategoryDto, @Req() {uid}) {
    return this.categoryService.addCustomCategory(data, uid);
  }

  @Post('edit')
  @Roles(Role.User)
  editCategory(@Body() data: editCategoryDto, @Req() {uid}) {
    return this.categoryService.editCategory(data,uid);
  }
}

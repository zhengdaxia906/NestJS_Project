import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Logger,
  Inject,
  LoggerService,
  UseFilters,
  Param,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';
import { TypeormFilter } from '../filters/typeorm.filter';
@Controller('user')
@UseFilters(new TypeormFilter())
export class UserController {
  constructor(
    private userService: UserService,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    // this.logger.log('UserController 初始化');
  }

  @Get()
  getUser(): any {
    return this.userService.findAll();
  }

  @Get('/:id')
  getUserByID(@Param('id') id: number): any {
    return this.userService.findOne(id);
  }

  @Post()
  addUser(@Body() dto: any): any {
    console.log(dto);

    const user = { ...dto } as User;
    return this.userService.create(user);
  }

  @Patch('/:id')
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Headers('Authorization') headers: any,
  ): any {
    // 判断是否时当前用户
    // 判断是否有更新权限
    // 返回数据不能包含隐私数据
    if (id !== headers) throw new UnauthorizedException();
    const newData = dto as User;
    return this.userService.update(id, newData);
  }

  @Delete()
  deleteUser(): any {
    return this.userService.remove(1);
  }

  @Get('/profile')
  getUserProfile(): any {
    return this.userService.findUserProfile(2);
  }
  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }
}

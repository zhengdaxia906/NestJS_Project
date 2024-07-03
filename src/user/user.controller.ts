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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';
@Controller('user')
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
    this.logger.log('getUser success');
    return this.userService.findAll();
  }

  @Post()
  addUser(@Body() data: any): any {
    console.log(data);

    const user = { ...data } as User;
    return this.userService.create(user);
  }

  @Patch()
  updateUser(): any {
    const user = { username: 'ly' } as User;
    return this.userService.update(1, user);
  }

  @Delete()
  deleteUser(): any {
    return this.userService.remove(1);
  }

  @Get('/profile')
  getUserProfile(): any {
    return this.userService.findUserProfile(2);
  }
  @Get('/profile')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }
}

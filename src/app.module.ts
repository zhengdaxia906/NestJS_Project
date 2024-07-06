import { Module, Logger, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from './enum/config.enum';
import { UserModule } from './user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { User } from './user/entities/user.entity';
import { Profile } from './user/entities/profile.entity';
import { Logs } from './logs/entities/logs.entity';
import { Roles } from './roles/entities/roles.entity';
import { RolesModule } from './roles/roles.module';
import { LogsModule } from './logs/logs.module';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
//app.module.ts
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().default(3306),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'mysql',
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Logs, Roles],
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          // logging: true, //使用查询是否打印sql语句 往往在开发环境打开
        }) as TypeOrmModuleOptions,
    }),
    UserModule,
    RolesModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}

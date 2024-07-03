//main.ts
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import * as winston from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file';
import { AllExceptionsFilter } from './filters/all-exception.filter';
// import { format } from 'path';
async function bootstrap() {
  // 1.创建winston实例
  const logger = WinstonModule.createLogger({
    //  一些配置项

    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        // 日志文件文件夹，建议使用path.join()方式来处理，或者process.cwd()来设置，此处仅作示范
        dirname: 'src/logs/logsfiles',
        // 日志文件名 %DATE% 会自动设置为当前日期
        filename: 'info-%DATE%.info.log',
        // 日期格式
        datePattern: 'YYYY-MM-DD',
        // 压缩文档，用于定义是否对存档的日志文件进行 gzip 压缩 默认值 false
        zippedArchive: true,
        // 文件最大大小，可以是bytes、kb、mb、gb
        maxSize: '20m',
        // 最大文件数，可以是文件数也可以是天数，天数加单位"d"，
        maxFiles: '7d',
        // 格式定义，同winston
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.json(),
          winston.format.simple(),
        ),

        // 日志等级，不设置所有日志将在同一个文件
        level: 'info',
      }),
      // 同上述方法，区分error日志和info日志，保存在不同文件，方便问题排查
      new winston.transports.DailyRotateFile({
        dirname: 'src/logs/logsfiles',
        filename: 'error-%DATE%.error.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.json(),
          winston.format.simple(),
        ),
        level: 'warn',
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
    // 2.配置nestjs logger为winston
    logger: logger,
  });
  //....
  // const { httpAdapter } = app.get(HttpAdapterHost);官方提供的写法会报类型错误
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(logger, httpAdapter)); //全局过滤器只允许提供一个
  await app.listen(3000);
}
bootstrap();

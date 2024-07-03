//main.ts
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import 'winston-daily-rotate-file';
import { AllExceptionsFilter } from './filters/all-exception.filter';
// import { format } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(WINSTON_MODULE_NEST_PROVIDER), httpAdapter),
  ); //全局过滤器只允许提供一个
  await app.listen(3000);
}
bootstrap();

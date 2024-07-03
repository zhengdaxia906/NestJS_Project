//all-exceptions.filter.tss
import {
  Catch,
  ExceptionFilter,
  LoggerService,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as requestIp from 'request-ip';
import { HttpAdapterHost } from '@nestjs/core';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // ...
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { httpAdapter } = this.httpAdapterHost;
    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      path: httpAdapter.getRequestUrl(request),
      timestamp: new Date().toISOString(),
      //   statusCode: httpStatus,
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: exception['response'] || 'Internal Server Error',
    };
    this.logger.error('[toimc]', responseBody); //加了一个错误的日志
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}

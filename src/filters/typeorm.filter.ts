import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
// import { timestamp } from 'rxjs';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch()
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let code = 500;
    if (exception instanceof QueryFailedError)
      //QueryFailedError 是一个通用错误，它表明数据库查询操作失败了。这个错误可能来自多种数据库，比如 PostgreSQL, MySQL, SQLite 等。
      code = exception.driverError.errno;
    response.status(500).json({
      code: code,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}

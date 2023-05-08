import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { UserAlreadyExistsException } from '../users/exceptions';

@Catch(UserAlreadyExistsException)
export class UserAlreadyExistsExceptionFilter implements ExceptionFilter {
  catch(exception: UserAlreadyExistsException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(status).json({
      message: message,
    });
  }
}

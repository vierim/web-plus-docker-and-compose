import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('Пользователь с таким имененем не найден', HttpStatus.NOT_FOUND);
  }
}

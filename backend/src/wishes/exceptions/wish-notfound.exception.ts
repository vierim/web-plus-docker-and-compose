import { HttpException, HttpStatus } from '@nestjs/common';

export class WishNotFoundException extends HttpException {
  constructor() {
    super('Подарок с указанным id не найден', HttpStatus.BAD_REQUEST);
  }
}

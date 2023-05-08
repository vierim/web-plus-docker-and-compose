import { HttpException, HttpStatus } from '@nestjs/common';

export class WishlistNotFoundException extends HttpException {
  constructor() {
    super('Список подарков с таким id не найден', HttpStatus.NOT_FOUND);
  }
}

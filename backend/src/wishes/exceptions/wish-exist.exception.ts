import { HttpException, HttpStatus } from '@nestjs/common';

export class WishAlreadyExistException extends HttpException {
  constructor() {
    super('У вас уже есть такой подарок в списке желаний', HttpStatus.CONFLICT);
  }
}

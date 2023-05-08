import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongOwnerException extends HttpException {
  constructor() {
    super(
      'Вы не можете редактировать или удалять чужие подарки',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

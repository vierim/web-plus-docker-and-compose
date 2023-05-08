import { HttpException, HttpStatus } from '@nestjs/common';

export class OwnInstanceException extends HttpException {
  constructor() {
    super(
      'Вы не можите вносить деньги на собственные подарки',
      HttpStatus.BAD_REQUEST,
    );
  }
}

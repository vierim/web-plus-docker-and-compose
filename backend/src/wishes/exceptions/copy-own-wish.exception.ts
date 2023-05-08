import { HttpException, HttpStatus } from '@nestjs/common';

export class CopyOwnWishException extends HttpException {
  constructor() {
    super(
      'Вы не можите копировать свои собственные подарки',
      HttpStatus.BAD_REQUEST,
    );
  }
}

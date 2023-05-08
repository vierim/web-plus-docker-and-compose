import { HttpException, HttpStatus } from '@nestjs/common';

export class WishRaisedException extends HttpException {
  constructor() {
    super(
      'Вы не можете редактировать данные подарка, на который уже поступили взносы',
      HttpStatus.BAD_REQUEST,
    );
  }
}

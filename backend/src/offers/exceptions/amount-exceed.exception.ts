import { HttpException, HttpStatus } from '@nestjs/common';

export class AmountExceedException extends HttpException {
  constructor() {
    super(
      'Превышена сумма, необходимая для покупки подарка',
      HttpStatus.BAD_REQUEST,
    );
  }
}

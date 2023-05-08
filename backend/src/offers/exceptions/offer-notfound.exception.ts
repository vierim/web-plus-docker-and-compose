import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferNotFoundException extends HttpException {
  constructor() {
    super('Заявка с таким id не найдена', HttpStatus.NOT_FOUND);
  }
}

import { HttpException } from '@nestjs/common';
import { MockMessagesEnum } from '../resource/mock-messages.enum';

export class OrderNotFoundException extends HttpException {
  constructor() {
    super(MockMessagesEnum.ORDER_NOT_FOUND, 404);
  }
}

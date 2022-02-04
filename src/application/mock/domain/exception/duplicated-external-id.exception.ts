import { HttpException } from '@nestjs/common';
import { MockMessagesEnum } from '../resource/mock-messages.enum';

export class DuplicatedExternalIdException extends HttpException {
  constructor() {
    super(MockMessagesEnum.DUPLICATED_EXTERNAL_ID, 405);
  }
}

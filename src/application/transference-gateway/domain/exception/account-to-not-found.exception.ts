import { HttpException } from '@nestjs/common';
import { TransferenceGatewayMessagesEnum } from '../resource/transference-gateway.messages.enum';

export class AccountToNotFoundException extends HttpException {
  constructor() {
    super(TransferenceGatewayMessagesEnum.ACCOUNT_TO_NOT_FOUND, 404);
  }
}

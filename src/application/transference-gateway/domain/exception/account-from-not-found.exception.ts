import { HttpException } from '@nestjs/common';
import { TransferenceGatewayMessagesEnum } from '../resource/transference-gateway.messages.enum';

export class AccountFromNotFoundException extends HttpException {
  constructor() {
    super(TransferenceGatewayMessagesEnum.ACCOUNT_FROM_NOT_FOUND, 406);
  }
}

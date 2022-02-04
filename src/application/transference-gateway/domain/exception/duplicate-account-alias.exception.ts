import { HttpException } from '@nestjs/common';
import { TransferenceGatewayMessagesEnum } from '../resource/transference-gateway.messages.enum';

export class DuplicateAccountAliasException extends HttpException {
  constructor() {
    super(TransferenceGatewayMessagesEnum.DUPLICATE_ACCOUNT_ALIAS, 400);
  }
}

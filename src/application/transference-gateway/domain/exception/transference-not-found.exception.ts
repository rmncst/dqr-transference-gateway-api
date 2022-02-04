import { HttpException } from '@nestjs/common';
import { TransferenceGatewayMessagesEnum } from '../resource/transference-gateway.messages.enum';

export class TransferenceNotFoundException extends HttpException {
  constructor() {
    super(TransferenceGatewayMessagesEnum.TRANSFERENCE_NOT_FOUND, 404);
  }
}

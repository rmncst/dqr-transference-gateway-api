import { TransferenceEntity } from '../../entity/transference.entity';
import { PaymentOrderDto } from '../../dto/payment-order.dto';

export type GetTransferenceUseCaseResponse = {
  transference: TransferenceEntity;
  order: PaymentOrderDto;
};

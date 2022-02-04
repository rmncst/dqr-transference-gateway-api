import { TransferenceEntity } from '../../entity/transference.entity';
import { PaymentOrderDto } from '../../dto/payment-order.dto';

export type MakeTransferenceUseCaseResponse = {
  transference: TransferenceEntity;
  order: PaymentOrderDto;
};

import { EntitySchema } from 'typeorm';
import { PaymentOrderEntity } from '../../domain/entity/payment-order.entity';

export const TypePaymentOrderEntity = new EntitySchema<PaymentOrderEntity>({
  name: 'payment_order',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    expectedOn: {
      type: Date,
      nullable: false,
    },
    amount: {
      type: Number,
      nullable: false,
    },
    externalId: {
      type: Number,
      nullable: false,
    },
    status: {
      type: String,
      nullable: false,
    },
  },
});

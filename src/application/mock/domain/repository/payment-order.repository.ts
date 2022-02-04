import {
  PaymentOrderEntity,
  PaymentOrderEntityStatusEnum,
} from '../entity/payment-order.entity';

export interface PaymentOrderRepository {
  createOrder(args: {
    externalId: number;
    expectedOn: Date;
    amount: number;
    status: PaymentOrderEntityStatusEnum;
  }): Promise<PaymentOrderEntity>;

  saveOrder(order: PaymentOrderEntity): Promise<PaymentOrderEntity>;
  findOrderByExternalId(externalId: number): Promise<PaymentOrderEntity>;
}

import { PaymentOrderDto } from '../dto/payment-order.dto';

export interface PaymentProxyServiceInterface {
  createOrder(args: {
    externalId: number;
    amount: number;
    expectedOn: Date;
  }): Promise<PaymentOrderDto>;

  findOrder(externalId: number): Promise<PaymentOrderDto>;
}

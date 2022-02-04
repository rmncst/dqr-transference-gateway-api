import { PaymentProxyServiceInterface } from '../../domain/service/payment-proxy.service.interface';
import { PaymentOrderDto } from '../../domain/dto/payment-order.dto';
import { Inject } from '@nestjs/common';
import axios from 'axios';

export class HttpPaymentProxyService implements PaymentProxyServiceInterface {
  constructor(
    @Inject('PAYMENT_PROXY_URL')
    private paymentProxyUrl: string,
  ) {}

  createOrder(args: {
    externalId: number;
    amount: number;
    expectedOn: Date;
  }): Promise<PaymentOrderDto> {
    return axios
      .post(`${this.paymentProxyUrl}/api/mock/order`, JSON.stringify(args), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data.data as PaymentOrderDto);
  }

  findOrder(externalId: number): Promise<PaymentOrderDto> {
    return axios
      .get(`${this.paymentProxyUrl}/api/mock/order/${externalId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data.data as PaymentOrderDto);
  }
}

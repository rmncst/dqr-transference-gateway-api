import { PaymentOrderRepository } from '../../domain/repository/payment-order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TypePaymentOrderEntity } from '../entity/type.payment-order.entity';
import { Repository } from 'typeorm';
import {
  PaymentOrderEntity,
  PaymentOrderEntityStatusEnum,
} from '../../domain/entity/payment-order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypePaymentOrderRepository implements PaymentOrderRepository {
  constructor(
    @InjectRepository(TypePaymentOrderEntity)
    private readonly paymentOrderRepo: Repository<PaymentOrderEntity>,
  ) {}

  createOrder(args: {
    externalId: number;
    expectedOn: Date;
    amount: number;
    status: PaymentOrderEntityStatusEnum;
  }): Promise<PaymentOrderEntity> {
    return this.paymentOrderRepo
      .insert(args)
      .then(() => args as PaymentOrderEntity);
  }

  findOrderByExternalId(externalId: number): Promise<PaymentOrderEntity> {
    return this.paymentOrderRepo.findOne({
      where: { externalId },
    });
  }

  saveOrder(order: PaymentOrderEntity): Promise<PaymentOrderEntity> {
    return this.paymentOrderRepo.save(order);
  }
}

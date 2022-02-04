import { UseCaseInterface } from '../../../../../core/base/use-case.interface';
import { GetOrderUserCaseArgs } from './get-order.user-case.args';
import { BaseResponseInterface } from '../../../../../core/base/base-response.interface';
import { PaymentOrderEntity } from '../../entity/payment-order.entity';
import { Inject, Injectable } from '@nestjs/common';
import {
  FieldErrorValidation,
  FieldErrorValidationErrorEnum,
} from '../../../../../core/base/field-error.validation';
import { ValidationException } from '../../../../../core/exception/validation.exception';
import { MockMessagesEnum } from '../../resource/mock-messages.enum';
import { TypePaymentOrderRepository } from '../../../infra/repository/type.payment-order.repository';
import { PaymentOrderRepository } from '../../repository/payment-order.repository';
import { OrderNotFoundException } from '../../exception/order-not-found.exception';

@Injectable()
export class GetOrderUserCase
  implements
    UseCaseInterface<
      GetOrderUserCaseArgs,
      BaseResponseInterface<PaymentOrderEntity>
    >
{
  constructor(
    @Inject(TypePaymentOrderRepository)
    private readonly paymentOrderRepo: PaymentOrderRepository,
  ) {}

  async handle(
    args: GetOrderUserCaseArgs,
  ): Promise<BaseResponseInterface<PaymentOrderEntity>> {
    const order = await this.paymentOrderRepo.findOrderByExternalId(
      args.externalId,
    );
    if (!order) {
      throw new OrderNotFoundException();
    }
    return {
      message: MockMessagesEnum.GET_ORDER,
      data: order,
    };
  }

  validate(args: GetOrderUserCaseArgs): any {
    const errors: FieldErrorValidation[] = [];
    if (!args.externalId) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'externalId',
      });
    }

    if (errors.length) {
      throw new ValidationException(MockMessagesEnum.GET_ORDER_ERROR, errors);
    }
  }
}

import { UseCaseInterface } from '../../../../../core/base/use-case.interface';
import { CreateOrderUseCaseArgs } from './create-order.use-case.args';
import { BaseResponseInterface } from '../../../../../core/base/base-response.interface';
import {
  PaymentOrderEntity,
  PaymentOrderEntityStatusEnum,
} from '../../entity/payment-order.entity';
import { Inject, Injectable } from '@nestjs/common';
import {
  FieldErrorValidation,
  FieldErrorValidationErrorEnum,
} from '../../../../../core/base/field-error.validation';
import { ValidationException } from '../../../../../core/exception/validation.exception';
import { MockMessagesEnum } from '../../resource/mock-messages.enum';
import { TypePaymentOrderRepository } from '../../../infra/repository/type.payment-order.repository';
import { PaymentOrderRepository } from '../../repository/payment-order.repository';
import { DuplicatedExternalIdException } from '../../exception/duplicated-external-id.exception';

@Injectable()
export class CreateOrderUseCase
  implements
    UseCaseInterface<
      CreateOrderUseCaseArgs,
      BaseResponseInterface<PaymentOrderEntity>
    >
{
  constructor(
    @Inject(TypePaymentOrderRepository)
    private readonly paymentOrderRepo: PaymentOrderRepository,
  ) {}

  async handle(
    args: CreateOrderUseCaseArgs,
  ): Promise<BaseResponseInterface<PaymentOrderEntity>> {
    args.amount = args.amount * 100;
    const { amount, externalId } = args;

    const testDup = await this.paymentOrderRepo.findOrderByExternalId(
      externalId,
    );
    if (testDup) {
      throw new DuplicatedExternalIdException();
    }

    const expectedOn = new Date(args.expectedOn);
    if (expectedOn.getTime() < Date.now()) {
      return this.paymentOrderRepo
        .createOrder({
          externalId,
          expectedOn: new Date(expectedOn),
          amount,
          status: PaymentOrderEntityStatusEnum.REJECTED,
        })
        .then((data) => ({
          message: MockMessagesEnum.CREATE_ORDER,
          data,
        }));
    }

    const tomorrow = new Date();
    tomorrow.setUTCHours(new Date().getUTCHours() + 24);
    if (tomorrow < expectedOn) {
      return this.paymentOrderRepo
        .createOrder({
          externalId,
          expectedOn: new Date(expectedOn),
          amount,
          status: PaymentOrderEntityStatusEnum.SCHEDULED,
        })
        .then((data) => ({
          message: MockMessagesEnum.CREATE_ORDER,
          data,
        }));
    }
    const created = await this.paymentOrderRepo.createOrder({
      externalId,
      expectedOn: new Date(expectedOn),
      amount,
      status: PaymentOrderEntityStatusEnum.CREATED,
    });

    await this.paymentOrderRepo.saveOrder({
      ...created,
      status: PaymentOrderEntityStatusEnum.APPROVED,
    });

    return {
      message: MockMessagesEnum.CREATE_ORDER,
      data: created,
    };
  }

  validate(args: CreateOrderUseCaseArgs): any {
    const errors: FieldErrorValidation[] = [];
    if (!args.amount) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'amount',
      });
    }
    if (!args.externalId) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'externalId',
      });
    }
    if (!args.expectedOn) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'expectedOn',
      });
    } else {
      if (!Date.parse(args.expectedOn)) {
        errors.push({
          error: FieldErrorValidationErrorEnum.INVALID_DATE,
          field: 'expectedOn',
        });
      }
    }

    if (errors.length) {
      throw new ValidationException(
        MockMessagesEnum.CREATE_ORDER_ERROR,
        errors,
      );
    }
  }
}

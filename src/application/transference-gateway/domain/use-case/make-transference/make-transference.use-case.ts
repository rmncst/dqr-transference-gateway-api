import { UseCaseInterface } from '../../../../../core/base/use-case.interface';
import { MakeTransferenceUseCaseArgs } from './make-transference.use-case.args';
import { BaseResponseInterface } from '../../../../../core/base/base-response.interface';
import { Inject, Injectable } from '@nestjs/common';
import {
  FieldErrorValidation,
  FieldErrorValidationErrorEnum,
} from '../../../../../core/base/field-error.validation';
import { ValidationException } from '../../../../../core/exception/validation.exception';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';
import { TypeAccountRepository } from '../../../infra/repository/type.account.repository';
import { AccountRepository } from '../../repository/account.repository';
import { TypeTransferenceRepository } from '../../../infra/repository/type.transference.repository';
import { TransferenceRepository } from '../../repository/transference.repository';
import { AccountFromNotFoundException } from '../../exception/account-from-not-found.exception';
import { AccountToNotFoundException } from '../../exception/account-to-not-found.exception';
import { HttpPaymentProxyService } from '../../../infra/infra/http.payment-proxy.service';
import { PaymentProxyServiceInterface } from '../../service/payment-proxy.service.interface';
import { MakeTransferenceUseCaseResponse } from './make-transference.use-case.response';

@Injectable()
export class MakeTransferenceUseCase
  implements
    UseCaseInterface<
      MakeTransferenceUseCaseArgs,
      BaseResponseInterface<MakeTransferenceUseCaseResponse>
    >
{
  constructor(
    @Inject(TypeAccountRepository)
    private readonly accountRepo: AccountRepository,
    @Inject(TypeTransferenceRepository)
    private readonly transferenceRepo: TransferenceRepository,
    @Inject(HttpPaymentProxyService)
    private readonly paymentProxyService: PaymentProxyServiceInterface,
  ) {}

  async handle(
    args: MakeTransferenceUseCaseArgs,
  ): Promise<BaseResponseInterface<MakeTransferenceUseCaseResponse>> {
    const { accountFromId, accountToId } = args;
    const transferenceFrom = await this.accountRepo.findById(accountFromId);
    if (!transferenceFrom) {
      throw new AccountFromNotFoundException();
    }

    const transferenceTo = await this.accountRepo.findById(accountToId);
    if (!transferenceTo) {
      throw new AccountToNotFoundException();
    }
    const dto = {
      ...args,
      amount: parseFloat(args.amount.toFixed(2)),
      transferenceTo,
      transferenceFrom,
      expectedOn: new Date(args.expectedOn),
    };
    const transference = await this.transferenceRepo.createTransference(dto);
    const order = await this.paymentProxyService
      .createOrder({
        ...transference,
        externalId: transference.id,
      })
      .catch(() => null);
    if (!order) {
      transference.paymentOrderError = true;
      await this.transferenceRepo.saveTransference(transference);
    }

    return {
      message: TransferenceGatewayMessagesEnum.MAKE_TRANSFER,
      data: {
        transference,
        order,
      },
    };
  }

  validate(args: MakeTransferenceUseCaseArgs): any {
    const errors: FieldErrorValidation[] = [];
    if (!args.amount) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'amount',
      });
    }
    if (!args.accountFromId) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'accountFromId',
      });
    }
    if (!args.accountToId) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'accountToId',
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
        TransferenceGatewayMessagesEnum.MAKE_TRANSFER_ERROR,
        errors,
      );
    }
  }
}

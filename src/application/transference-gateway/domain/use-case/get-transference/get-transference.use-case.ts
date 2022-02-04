import { UseCaseInterface } from '../../../../../core/base/use-case.interface';
import { GetTransferenceUseCaseArgs } from './get-transference.use-case.args';
import { BaseResponseInterface } from '../../../../../core/base/base-response.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';
import { TypeTransferenceRepository } from '../../../infra/repository/type.transference.repository';
import { TransferenceRepository } from '../../repository/transference.repository';
import {
  FieldErrorValidation,
  FieldErrorValidationErrorEnum,
} from '../../../../../core/base/field-error.validation';
import { ValidationException } from '../../../../../core/exception/validation.exception';
import { TransferenceNotFoundException } from '../../exception/transference-not-found.exception';
import { HttpPaymentProxyService } from '../../../infra/infra/http.payment-proxy.service';
import { PaymentProxyServiceInterface } from '../../service/payment-proxy.service.interface';
import { GetTransferenceUseCaseResponse } from './get-transference.use-case.response';

@Injectable()
export class GetTransferenceUseCase
  implements
    UseCaseInterface<
      GetTransferenceUseCaseArgs,
      BaseResponseInterface<GetTransferenceUseCaseResponse>
    >
{
  constructor(
    @Inject(TypeTransferenceRepository)
    private readonly transferenceRepo: TransferenceRepository,
    @Inject(HttpPaymentProxyService)
    private readonly paymentProxyService: PaymentProxyServiceInterface,
  ) {}

  async handle(
    args: GetTransferenceUseCaseArgs,
  ): Promise<BaseResponseInterface<GetTransferenceUseCaseResponse>> {
    const transference = await this.transferenceRepo.findById(
      args.transferenceId,
    );
    if (!transference) {
      throw new TransferenceNotFoundException();
    }
    const order = await this.paymentProxyService
      .findOrder(transference.id)
      .catch(() => null);

    return {
      message: TransferenceGatewayMessagesEnum.GET_TRANSFERENCE,
      data: {
        transference,
        order,
      },
    };
  }

  validate(args: GetTransferenceUseCaseArgs): any {
    const errors: FieldErrorValidation[] = [];
    if (!args.transferenceId) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'transferenceId',
      });
    }

    if (errors.length) {
      throw new ValidationException(
        TransferenceGatewayMessagesEnum.GET_TRANSFERENCE_ERROR,
        errors,
      );
    }
  }
}

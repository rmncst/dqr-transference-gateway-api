import { UseCaseInterface } from '../../../../../core/base/use-case.interface';
import { ListTransferenceUseCaseArgs } from './list-transference.use-case.args';
import { BaseResponseInterface } from '../../../../../core/base/base-response.interface';
import { TransferenceEntity } from '../../entity/transference.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';
import { TypeTransferenceRepository } from '../../../infra/repository/type.transference.repository';
import { TransferenceRepository } from '../../repository/transference.repository';

@Injectable()
export class ListTransferenceUseCase
  implements
    UseCaseInterface<
      ListTransferenceUseCaseArgs,
      BaseResponseInterface<TransferenceEntity[]>
    >
{
  constructor(
    @Inject(TypeTransferenceRepository)
    private readonly transferenceRepo: TransferenceRepository,
  ) {}
  async handle(
    args: ListTransferenceUseCaseArgs,
  ): Promise<BaseResponseInterface<TransferenceEntity[]>> {
    return this.transferenceRepo.listTransfers().then((data) => ({
      message: TransferenceGatewayMessagesEnum.LIST_TRANSFERENCE,
      data,
    }));
  }

  validate(args: ListTransferenceUseCaseArgs): any {
    return;
  }
}

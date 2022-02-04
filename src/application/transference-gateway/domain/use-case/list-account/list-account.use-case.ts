import { UseCaseInterface } from '../../../../../core/base/use-case.interface';
import { ListAccountUseCaseArgs } from './list-account.use-case.args';
import { AccountEntity } from '../../entity/account.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';
import { TypeAccountRepository } from '../../../infra/repository/type.account.repository';
import { AccountRepository } from '../../repository/account.repository';
import { BaseResponseInterface } from '../../../../../core/base/base-response.interface';

@Injectable()
export class ListAccountUseCase
  implements
    UseCaseInterface<
      ListAccountUseCaseArgs,
      BaseResponseInterface<AccountEntity[]>
    >
{
  constructor(
    @Inject(TypeAccountRepository)
    private readonly accountRepo: AccountRepository,
  ) {}

  async handle(
    args: ListAccountUseCaseArgs,
  ): Promise<BaseResponseInterface<AccountEntity[]>> {
    return this.accountRepo.listAccounts().then((data) => ({
      message: TransferenceGatewayMessagesEnum.LIST_ACCOUNT,
      data,
    }));
  }

  validate(args: ListAccountUseCaseArgs): any {
    return;
  }
}

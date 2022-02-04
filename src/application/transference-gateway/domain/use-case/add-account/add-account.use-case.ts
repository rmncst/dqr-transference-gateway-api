import { UseCaseInterface } from '../../../../../core/base/use-case.interface';
import { AddAccountUseCaseArgs } from './add-account.use-case.args';
import { AccountEntity } from '../../entity/account.entity';
import {
  FieldErrorValidation,
  FieldErrorValidationErrorEnum,
} from '../../../../../core/base/field-error.validation';
import { ValidationException } from '../../../../../core/exception/validation.exception';
import { Inject, Injectable } from '@nestjs/common';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';
import { TypeAccountRepository } from '../../../infra/repository/type.account.repository';
import { AccountRepository } from '../../repository/account.repository';
import { DuplicateAccountAliasException } from '../../exception/duplicate-account-alias.exception';
import { BaseResponseInterface } from '../../../../../core/base/base-response.interface';

@Injectable()
export class AddAccountUseCase
  implements
    UseCaseInterface<
      AddAccountUseCaseArgs,
      BaseResponseInterface<AccountEntity>
    >
{
  constructor(
    @Inject(TypeAccountRepository)
    private readonly accountRepo: AccountRepository,
  ) {}

  async handle(
    args: AddAccountUseCaseArgs,
  ): Promise<BaseResponseInterface<AccountEntity>> {
    const test = await this.accountRepo.findByOwnerAndAlias(
      args.owner,
      args.alias,
    );
    if (test) {
      throw new DuplicateAccountAliasException();
    }

    return this.accountRepo.addAccount(args).then((data) => ({
      message: TransferenceGatewayMessagesEnum.ADD_ACCOUNT,
      data,
    }));
  }

  validate(args: AddAccountUseCaseArgs): any {
    const errors: FieldErrorValidation[] = [];
    if (!args.owner) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'owner',
      });
    }
    if (!args.alias) {
      errors.push({
        error: FieldErrorValidationErrorEnum.FIELD_REQUIRED,
        field: 'alias',
      });
    }

    if (errors.length) {
      throw new ValidationException(
        TransferenceGatewayMessagesEnum.ADD_ACCOUNT_ERROR,
        errors,
      );
    }
  }
}

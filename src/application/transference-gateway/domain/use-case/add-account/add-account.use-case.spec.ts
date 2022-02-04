import { AccountRepository } from '../../repository/account.repository';
import { AddAccountUseCaseArgs } from './add-account.use-case.args';
import { AddAccountUseCase } from './add-account.use-case';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';
import { DuplicateAccountAliasException } from '../../exception/duplicate-account-alias.exception';
import { ValidationException } from '../../../../../core/exception/validation.exception';

describe('Test AddAccount Use Case', () => {
  function getAccountRepoMock(): AccountRepository {
    return {
      addAccount: jest.fn(),
      findById: jest.fn(),
      findByOwnerAndAlias: jest.fn(),
      listAccounts: jest.fn(),
    };
  }

  describe('test handle function', () => {
    it('should return success', () => {
      const args: AddAccountUseCaseArgs = {
        owner: 'something',
        alias: 'principal_account',
      };

      const accountRepo: AccountRepository = {
        ...getAccountRepoMock(),
        findByOwnerAndAlias: () => Promise.resolve(null),
        addAccount: (args) =>
          Promise.resolve({
            ...args,
            id: 123,
          }),
      };
      const useCase = new AddAccountUseCase(accountRepo);
      expect(useCase.handle(args)).resolves.toHaveProperty(
        'message',
        TransferenceGatewayMessagesEnum.ADD_ACCOUNT,
      );
    });

    it('should return error duplicated data', () => {
      const args: AddAccountUseCaseArgs = {
        owner: 'something',
        alias: 'principal_account',
      };

      const accountRepo: AccountRepository = {
        ...getAccountRepoMock(),
        findByOwnerAndAlias: () => Promise.resolve({ ...args, id: 123 }),
      };
      const useCase = new AddAccountUseCase(accountRepo);
      expect(useCase.handle(args)).rejects.toThrowError(
        DuplicateAccountAliasException,
      );
    });
  });

  describe('test validate function', () => {
    it('should throw validation exception without owner', () => {
      const args: AddAccountUseCaseArgs = {
        owner: null,
        alias: 'principal_account',
      };

      const useCase = new AddAccountUseCase(getAccountRepoMock());
      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });
    it('should throw validation exception without alias', () => {
      const args: AddAccountUseCaseArgs = {
        owner: 'something',
        alias: null,
      };

      const useCase = new AddAccountUseCase(getAccountRepoMock());
      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });
  });
});

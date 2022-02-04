import { AccountRepository } from '../../repository/account.repository';
import { ListAccountUseCase } from './list-account.use-case';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';

describe('Test List Account Use Case', () => {
  function mockAccountRepository(): AccountRepository {
    return {
      addAccount: jest.fn(),
      findById: jest.fn(),
      findByOwnerAndAlias: jest.fn(),
      listAccounts: jest.fn(),
    };
  }

  describe('test handle function', () => {
    it('handle should return success', () => {
      const repo: AccountRepository = {
        ...mockAccountRepository(),
        listAccounts: () =>
          Promise.resolve([
            {
              id: 1,
              alias: 'account_principal',
              owner: 'somthing',
            },
          ]),
      };

      const useCase = new ListAccountUseCase(repo);

      expect(useCase.handle({})).resolves.toHaveProperty(
        'message',
        TransferenceGatewayMessagesEnum.LIST_ACCOUNT,
      );
    });
  });

});

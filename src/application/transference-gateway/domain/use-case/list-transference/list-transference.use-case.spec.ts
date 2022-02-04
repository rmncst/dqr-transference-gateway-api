import { TransferenceRepository } from '../../repository/transference.repository';
import { TransferenceEntity } from '../../entity/transference.entity';
import { ListTransferenceUseCase } from './list-transference.use-case';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';

describe('Test List Transference Use Case', () => {
  function mockTransferenceRepo(): TransferenceRepository {
    return {
      findById: jest.fn(),
      saveTransference: jest.fn(),
      listTransfers: jest.fn(),
      createTransference: jest.fn(),
    };
  }

  function mockTransference(): TransferenceEntity {
    return {
      id: 123,
      paymentOrderError: false,
      createdAt: new Date(),
      amount: 123,
      transferenceFrom: {
        id: 1,
        owner: 'something',
        alias: 'principal_account',
      },
      transferenceTo: {
        id: 1,
        owner: 'something',
        alias: 'principal_account',
      },
      expectedOn: new Date(),
    };
  }

  describe('test handle function', () => {
    it('handle function should return success', () => {
      const repo: TransferenceRepository = {
        ...mockTransferenceRepo(),
        listTransfers: () => Promise.resolve([mockTransference()]),
      };

      const useCase = new ListTransferenceUseCase(repo);
      expect(useCase.handle({})).resolves.toHaveProperty(
        'message',
        TransferenceGatewayMessagesEnum.LIST_TRANSFERENCE,
      );
    });
  });
});

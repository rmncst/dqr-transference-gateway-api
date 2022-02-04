import { GetTransferenceUseCaseArgs } from './get-transference.use-case.args';
import { TransferenceRepository } from '../../repository/transference.repository';
import { TransferenceEntity } from '../../entity/transference.entity';
import { GetTransferenceUseCase } from './get-transference.use-case';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';
import { PaymentProxyServiceInterface } from '../../service/payment-proxy.service.interface';
import { TransferenceNotFoundException } from '../../exception/transference-not-found.exception';
import { ValidationException } from '../../../../../core/exception/validation.exception';

describe('Test Get Transference Use Case', () => {
  function mockTransferenceRepo(): TransferenceRepository {
    return {
      findById: jest.fn(),
      saveTransference: jest.fn(),
      listTransfers: jest.fn(),
      createTransference: jest.fn(),
    };
  }

  function mockPaymentProxyServiceInterface(): PaymentProxyServiceInterface {
    return {
      findOrder: jest.fn(),
      createOrder: jest.fn(),
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
    it('should return with success', () => {
      const args: GetTransferenceUseCaseArgs = {
        transferenceId: 123,
      };
      const mockedRepo: TransferenceRepository = {
        ...mockTransferenceRepo(),
        findById: (id: number) => Promise.resolve(mockTransference()),
      };
      const mockedService: PaymentProxyServiceInterface = {
        ...mockPaymentProxyServiceInterface(),
        findOrder: () => Promise.resolve(null),
      };

      const useCase = new GetTransferenceUseCase(mockedRepo, mockedService);

      expect(useCase.handle(args)).resolves.toHaveProperty(
        'message',
        TransferenceGatewayMessagesEnum.GET_TRANSFERENCE,
      );
    });

    it('should return transference not found', () => {
      const args: GetTransferenceUseCaseArgs = {
        transferenceId: 123,
      };
      const mockedRepo: TransferenceRepository = {
        ...mockTransferenceRepo(),
        findById: () => Promise.resolve(null),
      };
      const mockedService: PaymentProxyServiceInterface = {
        ...mockPaymentProxyServiceInterface(),
        findOrder: () => Promise.resolve(null),
      };

      const useCase = new GetTransferenceUseCase(mockedRepo, mockedService);

      expect(useCase.handle(args)).rejects.toThrowError(
        TransferenceNotFoundException,
      );
    });
  });

  describe('test validate function', () => {
    it('validate should throw error without transferenceId', () => {
      const args: GetTransferenceUseCaseArgs = {
        transferenceId: null,
      };
      const useCase = new GetTransferenceUseCase(
        mockTransferenceRepo(),
        mockPaymentProxyServiceInterface(),
      );
      expect(() => useCase.validate(args)).toThrowError(
        ValidationException
      );
    });
  })
});

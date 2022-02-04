import { TransferenceRepository } from '../../repository/transference.repository';
import { PaymentProxyServiceInterface } from '../../service/payment-proxy.service.interface';
import { TransferenceEntity } from '../../entity/transference.entity';
import { AccountRepository } from '../../repository/account.repository';
import { MakeTransferenceUseCaseArgs } from './make-transference.use-case.args';
import { AccountEntity } from '../../entity/account.entity';
import { PaymentOrderDto } from '../../dto/payment-order.dto';
import { MakeTransferenceUseCase } from './make-transference.use-case';
import { TransferenceGatewayMessagesEnum } from '../../resource/transference-gateway.messages.enum';
import { AccountFromNotFoundException } from '../../exception/account-from-not-found.exception';
import { AccountToNotFoundException } from '../../exception/account-to-not-found.exception';
import { ValidationException } from '../../../../../core/exception/validation.exception';

describe('Test Make Transference Use Case', () => {
  function mockAccountRepo(): AccountRepository {
    return {
      addAccount: jest.fn(),
      findById: jest.fn(),
      findByOwnerAndAlias: jest.fn(),
      listAccounts: jest.fn(),
    };
  }
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
  function mockAccount(): AccountEntity {
    return {
      id: 1,
      owner: 'barry allen',
      alias: 'account_principal',
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

  function mockPaymentOrder(): PaymentOrderDto {
    return {
      expectedOn: new Date().toDateString(),
      externalId: 1,
      amount: 123,
      status: 'something',
    };
  }

  describe('test handle function', () => {
    it('handle should return success', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: new Date().toDateString(),
        accountToId: 1,
        amount: 123,
        accountFromId: 2,
      };

      const transferenceRepo: TransferenceRepository = {
        ...mockTransferenceRepo(),
        createTransference: () => Promise.resolve(mockTransference()),
      };

      const accountRepo: AccountRepository = {
        ...mockAccountRepo(),
        findById: () => Promise.resolve(mockAccount()),
      };

      const paymentService: PaymentProxyServiceInterface = {
        ...mockPaymentProxyServiceInterface(),
        createOrder: () => Promise.resolve(mockPaymentOrder()),
      };

      const useCase = new MakeTransferenceUseCase(
        accountRepo,
        transferenceRepo,
        paymentService,
      );
      expect(useCase.handle(args)).resolves.toHaveProperty(
        'message',
        TransferenceGatewayMessagesEnum.MAKE_TRANSFER,
      );
    });

    it('handle should return order fail', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: new Date().toDateString(),
        accountToId: 1,
        amount: 123,
        accountFromId: 2,
      };

      const transferenceRepo: TransferenceRepository = {
        ...mockTransferenceRepo(),
        createTransference: () => Promise.resolve(mockTransference()),
      };

      const accountRepo: AccountRepository = {
        ...mockAccountRepo(),
        findById: () => Promise.resolve(mockAccount()),
      };

      const paymentService: PaymentProxyServiceInterface = {
        ...mockPaymentProxyServiceInterface(),
        createOrder: () => Promise.reject('error'),
      };

      const useCase = new MakeTransferenceUseCase(
        accountRepo,
        transferenceRepo,
        paymentService,
      );
      expect(useCase.handle(args)).resolves.toHaveProperty(
        'data.transference.paymentOrderError',
        true,
      );
    });

    it('handle should throw account from not found', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: new Date().toDateString(),
        accountToId: 1,
        amount: 123,
        accountFromId: 2,
      };

      const transferenceRepo: TransferenceRepository = {
        ...mockTransferenceRepo(),
        createTransference: () => Promise.resolve(mockTransference()),
      };

      const accountRepo: AccountRepository = {
        ...mockAccountRepo(),
        findById: (id) =>
          id == 1 ? Promise.resolve(mockAccount()) : Promise.resolve(null),
      };

      const paymentService: PaymentProxyServiceInterface = {
        ...mockPaymentProxyServiceInterface(),
        createOrder: () => Promise.resolve(mockPaymentOrder()),
      };

      const useCase = new MakeTransferenceUseCase(
        accountRepo,
        transferenceRepo,
        paymentService,
      );

      expect(useCase.handle(args)).rejects.toThrowError(
        AccountFromNotFoundException,
      );
    });

    it('handle should throw account to not found', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: new Date().toDateString(),
        accountToId: 1,
        amount: 123,
        accountFromId: 2,
      };

      const transferenceRepo: TransferenceRepository = {
        ...mockTransferenceRepo(),
        createTransference: () => Promise.resolve(mockTransference()),
      };

      const accountRepo: AccountRepository = {
        ...mockAccountRepo(),
        findById: (id) =>
          id == 2 ? Promise.resolve(mockAccount()) : Promise.resolve(null),
      };

      const paymentService: PaymentProxyServiceInterface = {
        ...mockPaymentProxyServiceInterface(),
        createOrder: () => Promise.resolve(mockPaymentOrder()),
      };

      const useCase = new MakeTransferenceUseCase(
        accountRepo,
        transferenceRepo,
        paymentService,
      );

      expect(useCase.handle(args)).rejects.toThrowError(
        AccountToNotFoundException,
      );
    });
  });

  describe('test validate function', () => {
    it('validate should throw ValidationException Without accountFromId', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: new Date().toDateString(),
        accountToId: 1,
        amount: 123,
        accountFromId: null,
      };

      const useCase = new MakeTransferenceUseCase(
        mockAccountRepo(),
        mockTransferenceRepo(),
        mockPaymentProxyServiceInterface(),
      );

      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });

    it('validate should throw ValidationException Without accountToId', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: new Date().toDateString(),
        accountToId: null,
        amount: 123,
        accountFromId: 1,
      };

      const useCase = new MakeTransferenceUseCase(
        mockAccountRepo(),
        mockTransferenceRepo(),
        mockPaymentProxyServiceInterface(),
      );

      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });

    it('validate should throw ValidationException Without expectedOn', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: null,
        accountToId: 2,
        amount: 123,
        accountFromId: 1,
      };

      const useCase = new MakeTransferenceUseCase(
        mockAccountRepo(),
        mockTransferenceRepo(),
        mockPaymentProxyServiceInterface(),
      );

      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });

    it('validate should throw ValidationException invalid expectedOn', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: 'invalid date',
        accountToId: 2,
        amount: 123,
        accountFromId: 1,
      };

      const useCase = new MakeTransferenceUseCase(
        mockAccountRepo(),
        mockTransferenceRepo(),
        mockPaymentProxyServiceInterface(),
      );

      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });

    it('validate should throw ValidationException without amount', () => {
      const args: MakeTransferenceUseCaseArgs = {
        expectedOn: 'invalid date',
        accountToId: 2,
        amount: null,
        accountFromId: 1,
      };

      const useCase = new MakeTransferenceUseCase(
        mockAccountRepo(),
        mockTransferenceRepo(),
        mockPaymentProxyServiceInterface(),
      );

      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });
  });
});

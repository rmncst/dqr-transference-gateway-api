import { CreateOrderUseCaseArgs } from './create-order.use-case.args';
import { PaymentOrderRepository } from '../../repository/payment-order.repository';
import {
  PaymentOrderEntity,
  PaymentOrderEntityStatusEnum,
} from '../../entity/payment-order.entity';
import { CreateOrderUseCase } from './create-order.use-case';
import { DuplicatedExternalIdException } from '../../exception/duplicated-external-id.exception';
import { ValidationException } from '../../../../../core/exception/validation.exception';

describe('Test Create Order Use Case', () => {
  function mockPaymentOrderRepository(): PaymentOrderRepository {
    return {
      saveOrder: jest.fn(),
      createOrder: jest.fn(),
      findOrderByExternalId: jest.fn(),
    };
  }

  function mockPaymentOrderEntity(
    status: PaymentOrderEntityStatusEnum,
  ): PaymentOrderEntity {
    return {
      amount: 123,
      status,
      expectedOn: new Date(),
      id: 123,
      externalId: 123,
    };
  }

  describe('test handle function', () => {
    it('handle should return status created', () => {
      const today = new Date();
      today.setUTCMinutes(today.getUTCMinutes() + 60);
      const args: CreateOrderUseCaseArgs = {
        amount: 123,
        expectedOn: today.toISOString(),
        externalId: 12,
      };
      const repo: PaymentOrderRepository = {
        ...mockPaymentOrderRepository(),
        findOrderByExternalId: () => Promise.resolve(null),
        createOrder: (args) =>
          Promise.resolve(mockPaymentOrderEntity(args.status)),
      };

      const useCase = new CreateOrderUseCase(repo);
      expect(useCase.handle(args)).resolves.toHaveProperty(
        'data.status',
        PaymentOrderEntityStatusEnum.CREATED,
      );
    });
    it('handle should return status scheduled', () => {
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 2);
      const args: CreateOrderUseCaseArgs = {
        amount: 123,
        expectedOn: tomorrow.toISOString(),
        externalId: 12,
      };
      const repo: PaymentOrderRepository = {
        ...mockPaymentOrderRepository(),
        findOrderByExternalId: () => Promise.resolve(null),
        createOrder: (args) =>
          Promise.resolve(mockPaymentOrderEntity(args.status)),
      };

      const useCase = new CreateOrderUseCase(repo);
      expect(useCase.handle(args)).resolves.toHaveProperty(
        'data.status',
        PaymentOrderEntityStatusEnum.SCHEDULED,
      );
    });
    it('handle should return status rejected', () => {
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getDate() - 1);
      const args: CreateOrderUseCaseArgs = {
        amount: 123,
        expectedOn: yesterday.toDateString(),
        externalId: 12,
      };
      const repo: PaymentOrderRepository = {
        ...mockPaymentOrderRepository(),
        findOrderByExternalId: () => Promise.resolve(null),
        createOrder: (args) =>
          Promise.resolve(mockPaymentOrderEntity(args.status)),
      };

      const useCase = new CreateOrderUseCase(repo);
      expect(useCase.handle(args)).resolves.toHaveProperty(
        'data.status',
        PaymentOrderEntityStatusEnum.REJECTED,
      );
    });
    it('handle should throw duplicated order', () => {
      const args: CreateOrderUseCaseArgs = {
        amount: 123,
        expectedOn: new Date().toDateString(),
        externalId: 12,
      };
      const repo: PaymentOrderRepository = {
        ...mockPaymentOrderRepository(),
        findOrderByExternalId: () =>
          Promise.resolve(
            mockPaymentOrderEntity(PaymentOrderEntityStatusEnum.REJECTED),
          ),
        createOrder: (args) =>
          Promise.resolve(mockPaymentOrderEntity(args.status)),
      };

      const useCase = new CreateOrderUseCase(repo);
      expect(useCase.handle(args)).rejects.toThrowError(
        DuplicatedExternalIdException,
      );
    });
  });

  describe('test validate function', () => {
    it('should throw validation exception without external id', () => {
      const args: CreateOrderUseCaseArgs = {
        amount: 123,
        expectedOn: new Date().toDateString(),
        externalId: null,
      };
      const useCase = new CreateOrderUseCase(mockPaymentOrderRepository());
      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });
    it('should throw validation exception without expectedOn', () => {
      const args: CreateOrderUseCaseArgs = {
        amount: 123,
        expectedOn: null,
        externalId: 123,
      };
      const useCase = new CreateOrderUseCase(mockPaymentOrderRepository());
      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });
    it('should throw validation exception without amount', () => {
      const args: CreateOrderUseCaseArgs = {
        amount: null,
        expectedOn: new Date().toDateString(),
        externalId: 123,
      };
      const useCase = new CreateOrderUseCase(mockPaymentOrderRepository());
      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });
  });
});

import { PaymentOrderRepository } from '../../repository/payment-order.repository';
import {
  PaymentOrderEntity,
  PaymentOrderEntityStatusEnum,
} from '../../entity/payment-order.entity';
import { GetOrderUserCaseArgs } from './get-order.user-case.args';
import { GetOrderUserCase } from './get-order.user-case';
import { MockMessagesEnum } from '../../resource/mock-messages.enum';
import { OrderNotFoundException } from '../../exception/order-not-found.exception';
import { ValidationException } from '../../../../../core/exception/validation.exception';

describe('Test Get Order Use Case', () => {
  function mockPaymentOrderRepository(): PaymentOrderRepository {
    return {
      saveOrder: jest.fn(),
      createOrder: jest.fn(),
      findOrderByExternalId: jest.fn(),
    };
  }
  function mockPaymentOrderEntity(): PaymentOrderEntity {
    return {
      amount: 123,
      status: PaymentOrderEntityStatusEnum.APPROVED,
      expectedOn: new Date(),
      id: 123,
      externalId: 123,
    };
  }
  describe('test handle function', () => {
    it('should return success', () => {
      const args: GetOrderUserCaseArgs = {
        externalId: 123,
      };
      const repo: PaymentOrderRepository = {
        ...mockPaymentOrderRepository(),
        findOrderByExternalId: () => Promise.resolve(mockPaymentOrderEntity()),
      };

      const useCase = new GetOrderUserCase(repo);
      expect(useCase.handle(args)).resolves.toHaveProperty(
        'message',
        MockMessagesEnum.GET_ORDER,
      );
    });
    it('should return order not found', () => {
      const args: GetOrderUserCaseArgs = {
        externalId: 123,
      };
      const repo: PaymentOrderRepository = {
        ...mockPaymentOrderRepository(),
        findOrderByExternalId: () => Promise.resolve(null),
      };

      const useCase = new GetOrderUserCase(repo);
      expect(useCase.handle(args)).rejects.toThrowError(OrderNotFoundException);
    });
  });

  describe('test validate function', () => {
    it('should throw validation exception without external id', () => {
      const args: GetOrderUserCaseArgs = {
        externalId: null,
      };
      const useCase = new GetOrderUserCase(mockPaymentOrderRepository());
      expect(() => useCase.validate(args)).toThrowError(ValidationException);
    });
  });
});

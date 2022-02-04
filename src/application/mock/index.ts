import { Module } from '@nestjs/common';
import { TypePaymentOrderEntity } from './infra/entity/type.payment-order.entity';
import { TypePaymentOrderRepository } from './infra/repository/type.payment-order.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockController } from './infra/controller/mock.controller';
import useCases from './domain/use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TypePaymentOrderEntity])],
  controllers: [MockController],
  providers: [TypePaymentOrderRepository, ...useCases],
})
export class MockModule {}

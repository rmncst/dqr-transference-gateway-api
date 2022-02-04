import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderUseCase } from '../../domain/use-case/create-order/create-order.use-case';
import { GetOrderUserCase } from '../../domain/use-case/get-order/get-order.user-case';
import { CreateOrderUseCaseArgs } from '../../domain/use-case/create-order/create-order.use-case.args';

@Controller('api/mock/order')
export class MockController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUserCase,
  ) {}

  @Post()
  createOrderAction(@Body() args: CreateOrderUseCaseArgs) {
    this.createOrder.validate(args);
    return this.createOrder.handle(args);
  }

  @Get(':id')
  getAction(@Param('id') externalId: number) {
    this.getOrder.validate({ externalId });
    return this.getOrder.handle({ externalId });
  }
}

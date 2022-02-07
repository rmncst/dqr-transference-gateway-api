import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './infra/entity';
import controllers from './infra/controller';
import repositories from './infra/repository';
import useCases from './domain/use-case';
import { HttpPaymentProxyService } from './infra/service/http.payment-proxy.service';

const urlPaymentProxyFactory = {
  provide: 'PAYMENT_PROXY_URL',
  useFactory: () => `http://localhost:${process.env.APP_PORT ?? 3000}`,
};

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  providers: [
    ...repositories,
    ...useCases,
    urlPaymentProxyFactory,
    HttpPaymentProxyService,
  ],
  controllers: controllers,
})
export class TransferenceGatewayModule {}

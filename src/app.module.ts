import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TransferenceGatewayModule } from './application/transference-gateway';
import { MockModule } from './application/mock';
import { factoryConnection } from './core/database/factory.connection';
import { TypePaymentOrderEntity } from './application/mock/infra/entity/type.payment-order.entity';
import { TypeAccountEntity } from './application/transference-gateway/infra/entity/type.account.entity';
import { TypeTransferenceEntity } from './application/transference-gateway/infra/entity/type.transference.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    factoryConnection([
      TypePaymentOrderEntity,
      TypeAccountEntity,
      TypeTransferenceEntity,
    ]),
    TransferenceGatewayModule,
    MockModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

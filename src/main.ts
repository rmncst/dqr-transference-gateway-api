import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT ?? 3000, () => {
    logger.log(`Application listening on port ${process.env.APP_PORT ?? 3000}`);
  });
}
bootstrap();

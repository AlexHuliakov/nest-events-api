import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

import { EntityNotFoundErrorFilter } from './exceptions/entity-not-found-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  await app.listen(PORT);
}
bootstrap();

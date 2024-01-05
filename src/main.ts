import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './shared/config/swagger/swagger';
import { VALIDATION_PIPE } from './shared/config/config.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(VALIDATION_PIPE);
  app.setGlobalPrefix('api');
  SwaggerModule.setup('api', app, createDocument(app));

  await app.listen(3000);
}
bootstrap();

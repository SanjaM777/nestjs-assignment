import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const validationPipeService = require('@nestts/validation-pipes');

async function bootstrap() {
  try {
    validationPipeService();
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
  } catch(err) {

  }
}
bootstrap();

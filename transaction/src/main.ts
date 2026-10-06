import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { kafkaOptionsFactory } from './config/kafka/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const prefix = config.get<string>('HTTP_PREFIX') ?? '/api/transaction';
  const port = config.get<number>('HTTP_PORT') ?? 9002;
  const host = config.get<string>('HTTP_HOST') ?? 'localhost';
  const serviceName = config.get<string>('SERVICE_NAME') ?? 'transaction';

  app.setGlobalPrefix(prefix);

  app.connectMicroservice<MicroserviceOptions>(kafkaOptionsFactory());

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${serviceName} microservice`)
    .setDescription('API Documentation')
    .addServer(`http://${host}:${port}`) 
    .addServer(
      `http://localhost:${config.get('HTTP_PORT')}`,
    )     // ← БЕЗ префикса
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
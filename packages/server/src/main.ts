import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { SeederModule } from './infrastructure/seeder';
import { Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/demo-key.pem'),
    cert: fs.readFileSync('./secrets/demo-cert.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  const config = app.get(ConfigService);
  const microservice = app.connectMicroservice(config.QueueConfig);
  app.enableCors();
  const seeder = app.get(SeederModule);
  await seeder.seedData();
  await app.listen(config.Port);
  await app.startAllMicroservicesAsync().catch(e => Logger.error(e));
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederModule } from './infrastructure/seeder';
import { ConfigService } from './config/config.service';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const config = new ConfigService(`${process.env.NODE_ENV}.env`);

  const httpsOptions = {
    key: fs.readFileSync(`./secrets/${config.SslKey}`),
    cert: fs.readFileSync(`./secrets/${config.SslCert}`),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();
  const seeder = app.get(SeederModule);
  await seeder.seedData();
  await app.listen(config.Port);
}

bootstrap();

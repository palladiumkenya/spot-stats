import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederModule } from './infrastructure/seeder/seeder.module';
import { CqrsModule } from '@nestjs/cqrs';
import { routes } from './routes';
import { RouterModule } from 'nest-router';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CourtsModule } from './application/courts/courts.module';
import { TransfersModule } from './application/transfers/transfers.module';
import { RegistriesModule } from './application/registries';
import { MessagingModule } from './infrastructure/messging/messaging.module';
import { MessagingService } from './infrastructure/messging/messaging.service';

const cloudUrl = `mongodb+srv://livetest:maun@cluster0-v6fcj.mongodb.net/dwapiGlobe?retryWrites=true&w=majority`;
const localUrl = 'mongodb://localhost/dwapiGlobe';

@Module({
  imports: [
    ConfigModule,
    MessagingModule,
    RouterModule.forRoutes(routes),
    CqrsModule,
    DatabaseModule,
    CourtsModule,
    RegistriesModule,
    SeederModule,
    TransfersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

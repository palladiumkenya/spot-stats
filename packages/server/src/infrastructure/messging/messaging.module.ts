import { Module } from '@nestjs/common';
import { messagingProviders } from './messaging.providers';
import { ConfigModule } from '../../config/config.module';
import { MessagingService } from './messaging.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [...messagingProviders, ConfigModule, CqrsModule],
  exports: [...messagingProviders, MessagingService],
  providers: [MessagingService],
})
export class MessagingModule {}

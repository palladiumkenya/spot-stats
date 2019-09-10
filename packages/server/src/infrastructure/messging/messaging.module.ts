import { Module } from '@nestjs/common';
import { messagingProviders } from './messaging.providers';
import { ConfigModule } from '../../config/config.module';
import { TransfersModule } from '../../application/transfers/transfers.module';
import { ConfigService } from '../../config/config.service';

@Module({
  imports: [...messagingProviders, ConfigModule, TransfersModule],
  exports: [...messagingProviders],
})
export class MessagingModule {}

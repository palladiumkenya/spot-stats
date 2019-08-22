import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '../../config/config.service';
import { ConfigModule } from '../../config/config.module';

const messagingFactory = {
  provide: 'GLOBE_SERVICE',
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create(configService.QueueConfig);
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [messagingFactory],
  exports: [messagingFactory],
})
export class MessagingModule {}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CourtsInfrastructureModule } from '../../infrastructure/courts/courts-infrastructure.module';
import { NoticesController } from './controllers';
import { GetNoticesHandler } from './queries';
import { NotificationsInfrastructureModule } from '../../infrastructure/notifications';

@Module({
  imports: [
    CqrsModule,
    CourtsInfrastructureModule,
    NotificationsInfrastructureModule,
  ],
  controllers: [NoticesController],
  providers: [GetNoticesHandler],
})
export class NotificationsModule {}

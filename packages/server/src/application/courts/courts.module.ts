import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetDocketsHandler } from './queries/handlers/get-dockets.handler';
import { DocketsController } from './controllers/dockets.controller';
import { SaveDocketHandler } from './commands/handlers/save-docket.handler';
import { DeleteDocketHandler } from './commands/handlers/delete-docket.handler';
import { DocketCreatedEventHandler } from './events/handlers/docket-created.handler';
import { DocketDeletedEventHandler } from './events/handlers/docket-deleted.handler';
import { DocketUpdatedEventHandler } from './events/handlers/docket-updated.handler';
import { CourtsInfrastructureModule } from '../../infrastructure/courts/courts-infrastructure.module';

@Module({
  imports: [CqrsModule, CourtsInfrastructureModule],
  controllers: [DocketsController],
  providers: [
    SaveDocketHandler,
    DeleteDocketHandler,
    GetDocketsHandler,
    DocketCreatedEventHandler,
    DocketDeletedEventHandler,
    DocketUpdatedEventHandler,
  ],
})
export class CourtsModule {}

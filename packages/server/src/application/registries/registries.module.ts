import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CourtsInfrastructureModule } from '../../infrastructure/courts/courts-infrastructure.module';
import { RegistriesInfrastructureModule } from '../../infrastructure/registries/registries-infrastructure.module';
import { TransfersInfrastructureModule } from '../../infrastructure/transfers/transfers-infrastructure.module';
import { GetMasterFacilitiesHandler } from './queries/handlers/get-master-facilities.handler';
import { GetDocketsHandler } from '../courts/queries/handlers/get-dockets.handler';
import { MasterFacilitiesController } from './controllers/master-facilities.controller';
import { SaveMasterFacilityHandler } from './commands/handlers/save-master-facility.handler';
import { DeleteMasterFacilityHandler } from './commands/handlers/delete-master-facility.handler';
import { MasterFacilityCreatedHandler } from './events/handlers/master-facility-created.handler';
import { MasterFacilityDeletedEvent } from './events/master-facility-deleted.event';
import { MasterFacilityDeletedHandler } from './events/handlers/master-facility-deleted.handler';
import { MasterFacilityUpdatedHandler } from './events/handlers/master-facility-updated.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingModule } from '../../infrastructure/messging/messaging.module';

@Module({
  imports: [
    CqrsModule,
    MessagingModule,
    RegistriesInfrastructureModule,
    CourtsInfrastructureModule,
  ],
  controllers: [MasterFacilitiesController],
  providers: [
    SaveMasterFacilityHandler,
    DeleteMasterFacilityHandler,
    GetMasterFacilitiesHandler,
    GetDocketsHandler,
    MasterFacilityCreatedHandler,
    MasterFacilityDeletedHandler,
    MasterFacilityUpdatedHandler,
  ],
})
export class RegistriesModule {}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransfersInfrastructureModule } from '../../infrastructure/transfers';
import { LogManifestCommand } from './commands/log-manifest.command';
import { UpdateStatsHandler } from './commands/handlers/update-stats.handler';
import { InitializeSummariesHandler } from './commands/handlers/initialize-summaries.handler';
import { LogManifestHandler } from './commands/handlers/log-manifest.handler';
import { RegistriesInfrastructureModule } from '../../infrastructure/registries';
import { CourtsInfrastructureModule } from '../../infrastructure/courts';
import { GetStatsHandler } from './queries/handlers/get-stats.handler';
import { GetSummaryHandler } from './queries/handlers/get-summary.handler';
import { FacilitiesController } from './controllers/facilities.controller';
import { ManifestsController } from './controllers/manifests.controller';
import { FacilityEnrolledHandler } from './events/handlers/facility-enrolled.handler';
import { ManifestLoggedHandler } from './events/handlers/manifest-logged.handler';

const CommandHandlers = [
  LogManifestHandler,
  UpdateStatsHandler,
  InitializeSummariesHandler,
];
const EventHandlers = [FacilityEnrolledHandler, ManifestLoggedHandler];
const QueryHandlers = [GetStatsHandler, GetSummaryHandler];

@Module({
  imports: [
    CqrsModule,
    TransfersInfrastructureModule,
    RegistriesInfrastructureModule,
    CourtsInfrastructureModule,
  ],
  controllers: [FacilitiesController, ManifestsController],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class TransfersModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility } from '../../domain/transfers/facility';
import { facilitySchema } from './schemas/facility.schema';
import { Manifest } from '../../domain/transfers/manifest';
import { Summary } from '../../domain/transfers/summary';
import { summarySchema } from './schemas/summary.schema';
import { manifestSchema } from './schemas/mainifest.schema';
import { FacilityRepository } from './facility.repository';
import { ManifestRepository } from './manifest.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Facility.name, schema: facilitySchema },
    ]),
    MongooseModule.forFeature([
      { name: Manifest.name, schema: manifestSchema },
    ]),
    MongooseModule.forFeature([{ name: Summary.name, schema: summarySchema }]),
  ],
  providers: [
    { provide: 'IFacilityRepository', useClass: FacilityRepository },
    { provide: 'IManifestRepository', useClass: ManifestRepository },
  ],
  exports: [
    { provide: 'IFacilityRepository', useClass: FacilityRepository },
    { provide: 'IManifestRepository', useClass: ManifestRepository },
  ],
})
export class TransfersInfrastructureModule {}

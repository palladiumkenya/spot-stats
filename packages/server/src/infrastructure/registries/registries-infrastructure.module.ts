import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { masterFacilitySchema } from './schemas/master-facility.schema';
import { MasterFacilityRepository } from './master-facility.repository';
import { MasterFacility } from '../../domain/registries/master-facility';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MasterFacility.name, schema: masterFacilitySchema }]),
  ],
  providers: [
    { provide: 'IMasterFacilityRepository', useClass: MasterFacilityRepository },
  ],
  exports: [
    { provide: 'IMasterFacilityRepository', useClass: MasterFacilityRepository },
  ],
})
export class RegistriesInfrastructureModule {
}

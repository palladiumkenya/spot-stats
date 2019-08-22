import { SeedReader } from './seed-reader';
import { IMasterFacilityRepository } from '../../domain/registries/master-facility-repository.interface';
import { MasterFacility } from '../../domain/registries/master-facility';
export declare class MasterFacilitySeeder {
    private readonly reader;
    private readonly masterFacilityRepository;
    constructor(reader: SeedReader, masterFacilityRepository: IMasterFacilityRepository);
    load(): Promise<MasterFacility[]>;
    seed(): Promise<number>;
}

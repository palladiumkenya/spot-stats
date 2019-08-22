import { MasterFacilitySeeder } from './master-facility.seeder';
import { DocketSeeder } from './docket.seeder';
export declare class SeederModule {
    private readonly docketSeeder;
    private readonly masterFacilitySeeder;
    constructor(docketSeeder: DocketSeeder, masterFacilitySeeder: MasterFacilitySeeder);
    seedData(): Promise<void>;
}

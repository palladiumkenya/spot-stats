import { SeedReader } from './seed-reader';
import { IDocketRepository } from '../../domain/courts/docket-repository.interface';
import { Docket } from '../../domain/courts/docket';
export declare class DocketSeeder {
    private readonly reader;
    private readonly repository;
    constructor(reader: SeedReader, repository: IDocketRepository);
    load(): Promise<Docket[]>;
    seed(): Promise<number>;
}

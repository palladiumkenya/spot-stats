import { AggregateRoot } from '@nestjs/cqrs';
import { Manifest } from './manifest';
import { Summary } from './summary';
import { MasterFacility } from '../registries/master-facility';
export declare class Facility extends AggregateRoot {
    _id: string;
    code: number;
    name: string;
    manifests?: Manifest[];
    summaries?: Summary[];
    masterFacility?: MasterFacility;
    constructor(_id: string, code: number, name: string);
    addManifest(manifest: Manifest): void;
    assignMasterFacility(masterFacility: MasterFacility): void;
    summaryHasExtract(_id: string): boolean;
    addSummary(summary: Summary): void;
    updateSummary(docket: any, stats: any, updated: Date): void;
    resetSummary(_id: string, expected: any, updated: Date): void;
}

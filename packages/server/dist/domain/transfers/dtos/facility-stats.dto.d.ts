import { Manifest, MasterFacility, Summary } from '../..';
export interface FacilityStatsDto {
    code: number;
    name: string;
    activeManifest?: Manifest;
    patientSummary?: Summary;
    masterFacility?: MasterFacility;
}

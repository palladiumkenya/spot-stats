import { Manifest, MasterFacility, Summary } from '../..';
export interface FacilityStatsDto {
    manifests?: Manifest[];
    summaries?: Summary[];
    masterFacility?: MasterFacility;
}

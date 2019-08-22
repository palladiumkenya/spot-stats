import { Manifest, MasterFacility, Summary } from '../..';
export interface FacilitySummaryDto {
    manifests?: Manifest[];
    summaries?: Summary[];
    masterFacility?: MasterFacility;
}

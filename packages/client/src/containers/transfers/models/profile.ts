import { Manifest } from "./manifest";
import { Summary } from "./summary";
import { MasterFacility } from "./master-facility";

export interface Profile {
  _id?: string;
  code?: number;
  name?: string;
  manifests?: Manifest[];
  summaries?: Summary[];
  patientSummary?: Summary;
  masterFacility?: MasterFacility;
}

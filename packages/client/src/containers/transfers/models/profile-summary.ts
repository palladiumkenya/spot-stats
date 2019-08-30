import { Manifest } from "./manifest";
import { Summary } from "./summary";
import { MasterFacility } from "./master-facility";

export interface ProfileSummary {
  _id?: string;
  code?: string;
  name?: string;
  mId?: string;
  summaries?: Summary[];
  manifests?: Manifest[];
  masterFacility?: MasterFacility;
}

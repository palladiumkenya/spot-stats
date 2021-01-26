import { Manifest } from "./manifest";
import { Summary } from "./summary";
import { MasterFacility } from "./master-facility";
import { Metric } from "./metric";
import {Indicator} from "./indicator";

export interface ProfileSummary {
  _id?: string;
  code?: string;
  name?: string;
  mId?: string;
  summaries?: Summary[];
  manifests?: Manifest[];
  masterFacility?: MasterFacility;
  metrics?: Metric[];
  indicators?: Indicator[];
}

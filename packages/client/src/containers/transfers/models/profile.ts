import { Manifest } from "./manifest";

export interface Profile {
  _id?: string;
  mId: string;
  code?: number;
  name?: string;
  logDate?: Date;
  buildDate?: Date;
  docket: string;
  patientCount: number;
  manifests?: Manifest[];
  facilityInfo: any;
}

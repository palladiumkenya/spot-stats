import { Manifest } from "./manifest";

export interface Profile {
  _id?: string;
  mId?: string;
  code?: number;
  name?: string;
  logDate?: Date;
  buildDate?: Date;
  docket?: string;
  patientCount?: number;
  recievedCount?: number;
  recievedDate?: Date;
  manifests?: Manifest[];
  facilityInfo?: any;
  start?: Date,
  end?: Date,
  session?: string,
  tag?: string,
  handshakeStatus?: string,
}

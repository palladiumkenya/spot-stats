export interface ManifestDto {
  _id?: string;
  facility?: any;
  facilityInfo?: any;
  recievedCount?: number;
  recievedDate?: Date;
  start?: Date;
  end?: Date;
  session?: string;
  tag?: string;
  mId?: string;
  code?: number;
  name?: string;
  logDate?: Date;
  buildDate?: Date;
  docket?: string;
  patientCount?: number;
  cargo?: any;
  isCurrent?: boolean;
  handshakeStatus?: string;
}

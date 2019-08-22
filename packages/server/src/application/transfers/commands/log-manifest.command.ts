export class LogManifestCommand {
  constructor(
    public id: string,
    public facilityCode: number,
    public facilityName: string,
    public docket: string,
    public logDate: Date,
    public buildDate: Date,
    public patientCount: number,
    public cargo: string,
  ) {}
}

export class LogManifestCommand {
  public start?: Date;
  public end?: Date;
  public session?: string;
  public tag?: string;
  constructor(
    public id: string,
    public facilityCode: number,
    public facilityName: string,
    public docket: string,
    public logDate: Date,
    public buildDate: Date,
    public patientCount: number,
    public cargo: string,
    public isCurrent: boolean,
    public recievedCount?: number,
    public recievedDate?: Date,
  ) {}
}

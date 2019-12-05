export class LogMetricCommand {
  constructor(
    public id: string,
    public facilityCode: number,
    public facilityName: string,
    public area: string,
    public logDate: Date,
    public logReport: any,
  ) {}
}

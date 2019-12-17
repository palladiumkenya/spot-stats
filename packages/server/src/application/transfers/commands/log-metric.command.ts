export class LogMetricCommand {
  constructor(
    public id: string,
    public facilityCode: number,
    public facilityName: string,
    public cargo: any,
    public cargoType: number,
    public facilityManifestId: string,
  ) {}
}

export class UpdateStatsCommand {
  constructor(
    public facilityCode: number,
    public docket: any,
    public stats: any,
    public updated: Date,
    public manifestId?: string,
  ) {}
}

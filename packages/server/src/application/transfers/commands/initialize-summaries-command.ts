export class InitializeSummariesCommand {
  constructor(
    public readonly facilityId: string,
    public readonly manifestId: string,
  ) {}
}

export class SaveDocketCommand {
  constructor(
    public readonly name: string,
    public readonly display: string,
    public readonly _id?: string,
  ) {
  }
}

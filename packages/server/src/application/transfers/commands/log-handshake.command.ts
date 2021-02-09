export class LogHandshakeCommand {
  constructor(
    public id: string,
    public end: Date,
    public start?: Date,
    public session?: string,
    public tag?: string,
  ) {}
}

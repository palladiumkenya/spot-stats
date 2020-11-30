import { Facility } from '../../../domain';

export class ReInitializeSummariesCommand {
  constructor(public readonly facility: Facility, public manifestId?: string) {}
}

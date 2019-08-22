import { IEvent } from '@nestjs/cqrs';

export class ManifestLoggedEvent implements IEvent {
  constructor(
    public readonly facilityId: string,
    public readonly manifestId: string,
  ) {}
}

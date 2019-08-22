import { IEvent } from '@nestjs/cqrs';

export class ManifestProcessedEvent implements IEvent {
  constructor(
    public readonly facilityId: string,
    public readonly manifestId: string,
  ) {}
}

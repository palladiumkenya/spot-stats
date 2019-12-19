import { IEvent } from '@nestjs/cqrs';

export class MetricLoggedEvent implements IEvent {
  constructor(
    public readonly facilityId: string,
    public readonly manifestId: string,
  ) {}
}

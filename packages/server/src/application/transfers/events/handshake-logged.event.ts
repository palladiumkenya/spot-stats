import { IEvent } from '@nestjs/cqrs';

export class HandshakeLoggedEvent implements IEvent {
  constructor(public readonly manifestId: string) {}
}

import { IEventHandler } from '@nestjs/cqrs';
import { ManifestLoggedEvent } from '../manifest-logged.event';
export declare class ManifestLoggedHandler implements IEventHandler<ManifestLoggedEvent> {
    handle(event: ManifestLoggedEvent): void;
}

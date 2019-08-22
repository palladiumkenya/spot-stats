import { IEvent } from '@nestjs/cqrs';
export declare class ManifestProcessedEvent implements IEvent {
    readonly facilityId: string;
    readonly manifestId: string;
    constructor(facilityId: string, manifestId: string);
}

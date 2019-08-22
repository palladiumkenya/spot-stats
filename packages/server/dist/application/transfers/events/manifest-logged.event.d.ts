import { IEvent } from '@nestjs/cqrs';
export declare class ManifestLoggedEvent implements IEvent {
    readonly facilityId: string;
    readonly manifestId: string;
    constructor(facilityId: string, manifestId: string);
}

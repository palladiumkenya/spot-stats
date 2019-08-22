import { AggregateRoot } from '@nestjs/cqrs';
import { Extract } from './extract';
export declare class Docket extends AggregateRoot {
    name: string;
    display: string;
    _id: string;
    extracts: Extract[];
    constructor(name: string, display: string);
    toString(): string;
    addExtract(extract: Extract): void;
    changeDetails(name: string, display: string): void;
}

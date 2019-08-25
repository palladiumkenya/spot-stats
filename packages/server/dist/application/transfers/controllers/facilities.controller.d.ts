import { CommandBus, QueryBus } from '@nestjs/cqrs';
export declare class FacilitiesController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    getFacilityStats(id: any): Promise<{}>;
    handleUpdateStats(data: any): Promise<any>;
}

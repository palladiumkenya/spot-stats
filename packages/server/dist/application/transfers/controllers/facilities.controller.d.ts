import { CommandBus, QueryBus } from '@nestjs/cqrs';
export declare class FacilitiesController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    getStats(): Promise<any>;
    getFacilityStats(id: any): Promise<{}>;
    handleLogUpdated(data: any): Promise<any>;
    handleUpdateStats(data: any): Promise<any>;
}

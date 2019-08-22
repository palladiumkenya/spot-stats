import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DocketDto } from '../../../domain/courts/dtos/docket.dto';
export declare class DocketsController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    getDockets(): Promise<any>;
    createOrUpdateDocket(docket: DocketDto): Promise<any>;
    deleteDocket(id: any): Promise<any>;
}

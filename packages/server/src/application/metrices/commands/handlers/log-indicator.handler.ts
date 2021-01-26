import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {LogIndicatorCommand} from '../log-indicator.command';
import {Inject, Logger} from '@nestjs/common';
import {IIndicatorRepository} from '../../../../domain/metrices/indicator-repository.interface';
import {IFacilityRepository} from '../../../../domain';
import {Indicator} from '../../../../domain/metrices/indicator';

@CommandHandler(LogIndicatorCommand)
export class LogIndicatorHandler implements ICommandHandler<LogIndicatorCommand> {
    constructor(
        @Inject('IIndicatorRepository')
        private readonly indicatorRepository: IIndicatorRepository,
        @Inject('IFacilityRepository')
        private readonly facilityRepository: IFacilityRepository,
    ) {}

    async execute(command: LogIndicatorCommand): Promise<any> {
        try {
            const indicatorExists = await this.indicatorRepository.get(
                command._id,
            );
            if (indicatorExists) {
                return;
            }

            return await this.createIndicator(command);
        } catch (e) {
            Logger.error(e);
        }
    }

    private async createIndicator(command: LogIndicatorCommand) {
        const facility = await this.facilityRepository.findByCode(
            command.facilityCode
        );
        if (facility && command.name) {
            const indicator = new Indicator();
            indicator.facility = facility._id;
            indicator.name = command.name;
            indicator.value = command.value;
            indicator.indicatorDate = command.indicatorDate;
            indicator.stage = command.stage;
            indicator.facilityManifestId = command.facilityManifestId;
            await this.indicatorRepository.create(indicator);
        }
    }
}

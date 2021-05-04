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
    ) {
    }

    async execute(command: LogIndicatorCommand): Promise<any> {
        try {
            if (command.stage === 'EMR') {
                return await this.createIndicator(command);
            } else {
                return await this.updateIndicator(command);
            }
        } catch (e) {
            Logger.error(e);
        }
    }

    private async updateIndicator(command: LogIndicatorCommand) {
        try {
            const facility = await this.facilityRepository.findByCode(
                command.facilityCode,
            );
            if (facility && command.name) {
                const indicator = await this.indicatorRepository.findIndicatorByFacilityIdAndName(facility._id, command.name);
                if (indicator && indicator.length > 0) {
                    indicator[0].dwhIndicatorDate = command.dwhIndicatorDate;
                    indicator[0].dwhValue = command.dwhValue;
                    return await this.indicatorRepository.update(indicator[0]);
                } else {
                    Logger.error('indicator is null');
                }
            } else {
                Logger.error('facility and name not found');
                return null;
            }
        } catch (e) {
            Logger.error(e);
        }
    }

    private async createIndicator(command: LogIndicatorCommand) {
        const facility = await this.facilityRepository.findByCode(
            command.facilityCode,
        );
        if (facility && command.name) {
            const indicator = new Indicator();
            indicator.facility = facility._id;
            indicator.name = command.name;
            indicator.value = command.value;
            indicator.indicatorDate = command.indicatorDate;
            indicator.facilityManifestId = command.facilityManifestId;
            indicator.dwhValue = null;
            indicator.dwhIndicatorDate = null;
            await this.indicatorRepository.create(indicator);
        } else {
            Logger.error('facility not found or invalid command');
        }
    }
}

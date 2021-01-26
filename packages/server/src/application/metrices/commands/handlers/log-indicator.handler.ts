import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {LogIndicatorCommand} from '../log-indicator.command';
import {Inject, Logger} from '@nestjs/common';
import {IIndicatorRepository} from '../../../../domain/metrices/indicator-repository.interface';
import {Indicator} from '../../../../domain/metrices/indicator';

@CommandHandler(LogIndicatorCommand)
export class LogIndicatorHandler implements ICommandHandler<LogIndicatorCommand> {
    constructor(
        @Inject('IIndicatorRepository')
        private readonly indicatorRepository: IIndicatorRepository,
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
        const indicator = new Indicator();
        indicator.name = command.name;
        indicator.value = command.value;
        indicator.indicatorDate = command.indicatorDate;
        indicator.mId = command.mId;
        indicator.stage = command.stage;
        indicator.facility = command.facility;
        await this.indicatorRepository.create(indicator);
    }
}

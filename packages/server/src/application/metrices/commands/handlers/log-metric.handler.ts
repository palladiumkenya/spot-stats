import {
    CommandHandler,
    EventBus,
    EventPublisher,
    ICommandHandler,
} from '@nestjs/cqrs';
import {Inject, Logger} from '@nestjs/common';
import {
    Facility,
    IDocketRepository,
    IFacilityRepository,
    IMasterFacilityRepository,
} from '../../../../domain';
import * as uuid from 'uuid';
import {plainToClass} from 'class-transformer';
import {IMetricRepository} from '../../../../domain/metrices/metric-repository.interface';
import {LogMetricCommand} from '../log-metric.command';
import {MetricLoggedEvent} from '../../events/metric-logged.event';
import {Metric} from '../../../../domain/metrices/metric';
import {IMeasureRepository} from '../../../../domain/metrices/measure-repository.interface';

@CommandHandler(LogMetricCommand)
export class LogMetricHandler implements ICommandHandler<LogMetricCommand> {
    constructor(
        @Inject('IMasterFacilityRepository')
        private readonly masterFacilityRepository: IMasterFacilityRepository,
        @Inject('IDocketRepository')
        private readonly docketRepository: IDocketRepository,
        @Inject('IFacilityRepository')
        private readonly facilityRepository: IFacilityRepository,
        @Inject('IMetricRepository')
        private readonly metricRepository: IMetricRepository,
        @Inject('IMeasureRepository')
        private readonly measureRepository: IMeasureRepository,
        private readonly publisher: EventPublisher,
        private readonly eventBus: EventBus,
    ) {
    }

    async execute(command: LogMetricCommand): Promise<any> {
        try {
            // check if metric Exists
            const metricExists = await this.metricRepository.findByMetricId(
                command.id,
            );
            if (metricExists) {
                return;
            }

            // check or enroll Facility
            const facility = await this.enrollFacility(command);

            if (!facility) {
                return;
            }

            const newMetrics = await this.createMetrics(command);
            for (const newMetric of newMetrics) {
                if (facility) {
                    newMetric.facility = facility._id;
                    facility.addMetric(newMetric._id);
                }

                // log metric
                const metric = await this.metricRepository.create(newMetric);
                await this.metricRepository.updateCurrent(
                    newMetric.facility,
                    newMetric.measure,
                );
                this.publisher.mergeObjectContext(newMetric).commit();

                const enrolledFacility = await this.facilityRepository.update(facility);
                this.publisher.mergeObjectContext(facility).commit();

                Logger.log(`Metric processed ${facility.name}`);

                this.eventBus.publish(new MetricLoggedEvent(facility._id, metric._id));
            }

            return newMetrics;
        } catch (e) {
            Logger.error(e);
        }
        return undefined;
    }

    async enrollFacility(command: LogMetricCommand): Promise<Facility> {
        const facility = await this.facilityRepository.findWithManifestByCode(
            command.facilityCode,
        );

        if (facility) {
            return plainToClass(Facility, facility);
        }
        // TODO: metric arrives befor manifest
        // return undefined;

        const newFacility = new Facility(
            uuid.v1(),
            command.facilityCode,
            command.facilityName,
        );
        newFacility.addManifest(command.facilityManifestId);
        const masterFacility = await this.masterFacilityRepository.findByCode(
            command.facilityCode,
        );

        if (masterFacility) {
            newFacility.masterFacility = masterFacility;
        }
        const enrolledFacility = await this.facilityRepository.create(newFacility);
        this.publisher.mergeObjectContext(newFacility).commit();
        return newFacility;
    }

    createMetric(command: LogMetricCommand): Metric {
        const measure = this.generateMeasure(command.cargoType, command.cargo);
        const metric = new Metric(
            command.id,
            command.facilityCode,
            command.facilityName,
            measure,
            command.facilityManifestId,
        );
        metric.reportDate = this.getReportDate(command.cargo);
        return metric;
    }

    async createMetrics(command: LogMetricCommand): Promise<Metric[]> {
        const metrics: Metric[] = [];
        if (command.cargoType === 1) {
            // EmrName
            const metric1 = new Metric(
                command.id,
                '7eb13e4a-bb7b-11e9-9cb5-2a2ae2dbcce4',
                command.facilityCode,
                command.cargo.EmrName,
                command.facilityManifestId,
            );
            metric1.reportDate = command.cargo.DateExtracted;
            metrics.push(metric1);

            // EmrVersion
            const metric2 = new Metric(
                command.id,
                '7eb14e4a-bb7b-11e9-9cb5-2a2ae2dbcce4',
                command.facilityCode,
                command.cargo.EmrVersion,
                command.facilityManifestId,
            );
            metric2.reportDate = command.cargo.DateExtracted;
            metrics.push(metric2);

            // LastLoginDate
            const metric3 = new Metric(
                command.id,
                '7eb15e4a-bb7b-11e9-9cb5-2a2ae2dbcce4',
                command.facilityCode,
                command.cargo.LastLoginDate,
                command.facilityManifestId,
            );
            metric3.reportDate = command.cargo.DateExtracted;
            metrics.push(metric3);

            // LastMOH731RunDate
            const metric4 = new Metric(
                command.id,
                '7eb16e4a-bb7b-11e9-9cb5-2a2ae2dbcce4',
                command.facilityCode,
                command.cargo.LastMoH731RunDate,
                command.facilityManifestId,
            );
            metric4.reportDate = command.cargo.DateExtracted;
            metrics.push(metric4);
        }

        if (command.cargoType === 2) {
            const measure = await this.generateMeasure(
                command.cargoType,
                command.cargo,
            );
            let metavalue = command.cargo.LogDate;

            if (measure === '7eb29e4a-bb7b-11e9-9cb5-2a2ae2dbcce4') {
                metavalue = command.cargo.Version;
            }

            const metric = new Metric(
                command.id,
                measure,
                command.facilityCode,
                metavalue,
                command.facilityManifestId,
            );
            metric.reportDate = command.cargo.LogDate;
            const exisitngMetrics = metrics.filter(x => x._id === measure);
            if (exisitngMetrics.length === 0) {
                metrics.push(metric);
            }
        }
        return metrics;
    }

    async generateMeasure(any: number, cargo: any): Promise<string> {
        let area = cargo.Name;
        let name;

        if (cargo.Action === 'Sent') {
            name = 'ExtractSent';
        }
        if (cargo.Action === 'Loaded') {
            name = 'ExtractLoaded';
        }
        if (cargo.Name === 'MetricService') {
            area = 'Dwapi';
            name = 'DwapiVersion';
        }

        const m = await this.measureRepository.getByName(area, name);
        if (m) {
            return m._id;
        }
        return '';
    }

    getReportDate(cargo: any) {
        if (cargo.Action === 'Sent' || cargo.Action === 'Loaded') {
            return cargo.LogDate;
        }
        return cargo.DateExtracted;
    }
}

import {AggregateRoot} from '@nestjs/cqrs';
import {Manifest} from './manifest';
import {Summary} from './summary';
import {MasterFacility} from '../registries/master-facility';
import {DocketCreatedEvent} from '../../application/courts/events';
import {FacilityEnrolledEvent} from '../../application/transfers/events/facility-enrolled.event';
import {ManifestLoggedEvent} from '../../application/transfers/events/manifest-logged.event';
import {FacilityUpdatedEvent} from '../../application/transfers/events/facility-updated.event';
import {FacilityStatsUpdatedEvent} from '../../application/transfers/events/facility-stats-updated.event';
import {Metric} from '../metrices/metric';
import {Docket} from '../courts/docket';

export class Facility extends AggregateRoot {
    manifests?: any[] = [];
    summaries?: Summary[] = [];
    masterFacility?: MasterFacility;
    metrics?: any[] = [];

    constructor(public _id: string, public code: number, public name: string) {
        super();
        this.apply(new FacilityEnrolledEvent(this._id));
    }

    addManifest(manifestId: string) {
        if (this.manifests && this.manifests.length > 0) {
            const existing = this.manifests.filter(x => x === manifestId)[0];
            if (existing) {
                return;
            }
        }
        this.manifests.push(manifestId);
        this.apply(new FacilityUpdatedEvent(this._id));
    }

    addMetric(metricId: string) {
        this.metrics.push(metricId);
        this.apply(new FacilityUpdatedEvent(this._id));
    }

    assignMasterFacility(masterFacility: MasterFacility) {
        this.masterFacility = masterFacility;
        this.apply(new FacilityUpdatedEvent(this._id));
    }

    summaryHasExtract(_id: string) {
        const extract = this.summaries.find((s) => s.extract._id === _id);
        if (extract) {
            return true;
        }
        return false;
    }

    addSummary(summary: Summary) {
        this.summaries.push(summary);
        this.apply(new FacilityStatsUpdatedEvent(this._id));
    }

    updateSummary(docket: any, stats: any, updated: Date) {
        this.summaries
            .filter((s) => s.docket.name === docket.name.toUpperCase())
            .forEach((ss) => {
                const stat = stats.find((x) => x.name === ss.extract.name ||
                    x.name === `${ss.extract.name}Extract` ||
                    x.name === ss.extract.name.replace('Extract', ''));
                if (stat) {
                    ss.recieved = stat.recieved;
                    if (stat.updated) {
                        ss.updated = stat.updated;
                    } else {
                        ss.updated = new Date();
                    }
                }
            });
        this.apply(new FacilityStatsUpdatedEvent(this._id));
    }

    getPatientSummary(docket: string): any {
        const psum = this.summaries.find(
            (s) => s.docket.name === docket && s.extract.isPatient,
        );
        if (psum) {
            return psum.recieved;
        }
        return null;
    }

    resetSummary(_id: string, expected: any, updated: Date) {
        this.summaries.forEach((s) => {
            if (s.extract._id === _id) {
                s.expected = expected;
                s.recieved = 0;
                s.updated = updated;
            }
        });
    }

    getStats(docket: string, extract: string) {
        const s = this.summaries.find((f) => f.extract.name === extract);
        if (s) {
            return s;
        }
        return undefined;
    }

    hasSummaries(): boolean {
        if (!this.summaries) {
            return false;
        }

        if (this.summaries && this.summaries.length === 0) {
            return false;
        }

        return true;
    }

    hasDocketSummaries(docket: string): boolean {
        if (!this.summaries) {
            return false;
        }

        if (this.summaries && this.summaries.length > 0) {
            const ds = this.summaries.filter(xx => xx.docket.name === docket);
            return ds.length > 0;
        }
        return true;
    }
}

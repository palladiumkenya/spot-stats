"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cqrs_1 = require("@nestjs/cqrs");
const facility_enrolled_event_1 = require("../../application/transfers/events/facility-enrolled.event");
const facility_updated_event_1 = require("../../application/transfers/events/facility-updated.event");
const facility_stats_updated_event_1 = require("../../application/transfers/events/facility-stats-updated.event");
class Facility extends cqrs_1.AggregateRoot {
    constructor(_id, code, name) {
        super();
        this._id = _id;
        this.code = code;
        this.name = name;
        this.manifests = [];
        this.summaries = [];
        this.apply(new facility_enrolled_event_1.FacilityEnrolledEvent(this._id));
    }
    addManifest(manifestId) {
        this.manifests.push(manifestId);
        this.apply(new facility_updated_event_1.FacilityUpdatedEvent(this._id));
    }
    assignMasterFacility(masterFacility) {
        this.masterFacility = masterFacility;
        this.apply(new facility_updated_event_1.FacilityUpdatedEvent(this._id));
    }
    summaryHasExtract(_id) {
        const extract = this.summaries.find(s => s.extract._id === _id);
        if (extract) {
            return true;
        }
        return false;
    }
    addSummary(summary) {
        this.summaries.push(summary);
        this.apply(new facility_stats_updated_event_1.FacilityStatsUpdatedEvent(this._id));
    }
    updateSummary(docket, stats, updated) {
        this.summaries
            .filter(s => s.docket.name === docket.name)
            .forEach(ss => {
            const stat = stats.find(x => x.name === ss.extract.name);
            if (stat) {
                ss.recieved = stat.recieved;
                ss.updated = stat.updated;
            }
        });
        this.apply(new facility_stats_updated_event_1.FacilityStatsUpdatedEvent(this._id));
    }
    resetSummary(_id, expected, updated) {
        this.summaries.forEach(s => {
            if (s.extract._id === _id) {
                s.expected = expected;
                s.recieved = 0;
                s.updated = updated;
            }
        });
    }
}
exports.Facility = Facility;
//# sourceMappingURL=facility.js.map
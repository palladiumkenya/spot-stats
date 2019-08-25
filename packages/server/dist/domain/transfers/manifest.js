"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const cqrs_1 = require("@nestjs/cqrs");
const manifest_logged_event_1 = require("../../application/transfers/events/manifest-logged.event");
class Manifest extends cqrs_1.AggregateRoot {
    constructor(mId, code, name, logDate, buildDate, docket, patientCount, cargo, isCurrent) {
        super();
        this.mId = mId;
        this.code = code;
        this.name = name;
        this.logDate = logDate;
        this.buildDate = buildDate;
        this.docket = docket;
        this.patientCount = patientCount;
        this.cargo = cargo;
        this.isCurrent = isCurrent;
        this._id = uuid.v1();
    }
    assignFacility(facility) {
        facility.manifests = [];
        this.facility = facility._id;
        this.facilityInfo = facility;
        this.apply(new manifest_logged_event_1.ManifestLoggedEvent(facility._id, this._id));
    }
}
exports.Manifest = Manifest;
//# sourceMappingURL=manifest.js.map
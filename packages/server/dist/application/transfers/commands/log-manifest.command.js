"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LogManifestCommand {
    constructor(id, facilityCode, facilityName, docket, logDate, buildDate, patientCount, cargo) {
        this.id = id;
        this.facilityCode = facilityCode;
        this.facilityName = facilityName;
        this.docket = docket;
        this.logDate = logDate;
        this.buildDate = buildDate;
        this.patientCount = patientCount;
        this.cargo = cargo;
    }
}
exports.LogManifestCommand = LogManifestCommand;
//# sourceMappingURL=log-manifest.command.js.map
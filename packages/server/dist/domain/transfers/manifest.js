"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class Manifest {
    constructor(mId, logDate, buildDate, docket, patientCount, cargo) {
        this.mId = mId;
        this.logDate = logDate;
        this.buildDate = buildDate;
        this.docket = docket;
        this.patientCount = patientCount;
        this.cargo = cargo;
        this._id = uuid.v1();
    }
}
exports.Manifest = Manifest;
//# sourceMappingURL=manifest.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cqrs_1 = require("@nestjs/cqrs");
class MasterFacility extends cqrs_1.AggregateRoot {
    constructor(_id, code, name, county, mechanism) {
        super();
        this._id = _id;
        this.code = code;
        this.name = name;
        this.county = county;
        this.mechanism = mechanism;
    }
    changeDetails(code, name, county, mechanism) {
        this.code = code;
        this.name = name;
        this.county = county;
        this.mechanism = mechanism;
    }
}
exports.MasterFacility = MasterFacility;
//# sourceMappingURL=master-facility.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class Extract {
    constructor(name, display, isPatient, rank) {
        this.name = name;
        this.display = display;
        this.isPatient = isPatient;
        this.rank = rank;
        this._id = uuid();
    }
    toString() {
        return `${this.display}`;
    }
}
exports.Extract = Extract;
//# sourceMappingURL=extract.js.map
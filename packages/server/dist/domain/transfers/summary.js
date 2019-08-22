"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class Summary {
    constructor(docket, extract, expected, recieved, updated) {
        this.docket = docket;
        this.extract = extract;
        this.expected = expected;
        this.recieved = recieved;
        this.updated = updated;
        this._id = uuid.v1();
    }
}
exports.Summary = Summary;
//# sourceMappingURL=summary.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cqrs_1 = require("@nestjs/cqrs");
const uuid = require("uuid");
const events_1 = require("../../application/courts/events");
class Docket extends cqrs_1.AggregateRoot {
    constructor(name, display) {
        super();
        this.name = name;
        this.display = display;
        this.extracts = [];
        this._id = uuid();
        this.apply(new events_1.DocketCreatedEvent(this._id));
    }
    toString() {
        return `${this.display}`;
    }
    addExtract(extract) {
        const found = this.extracts.find(m => m._id === extract._id);
        if (found) {
            throw new Error(`Already Extract exists`);
        }
        this.extracts.push(extract);
    }
    changeDetails(name, display) {
        this.name = name;
        this.display = display;
    }
}
exports.Docket = Docket;
//# sourceMappingURL=docket.js.map
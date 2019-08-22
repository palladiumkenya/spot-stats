"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const master_facility_created_event_1 = require("../master-facility-created.event");
let MasterFacilityCreatedHandler = class MasterFacilityCreatedHandler {
    handle(event) {
        common_1.Logger.debug(`=== MasterFacilityCreated ===:${event._id}`);
    }
};
MasterFacilityCreatedHandler = __decorate([
    cqrs_1.EventsHandler(master_facility_created_event_1.MasterFacilityCreatedEvent)
], MasterFacilityCreatedHandler);
exports.MasterFacilityCreatedHandler = MasterFacilityCreatedHandler;
//# sourceMappingURL=master-facility-created.handler.js.map
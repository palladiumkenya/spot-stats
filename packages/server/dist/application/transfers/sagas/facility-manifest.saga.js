"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const operators_1 = require("rxjs/operators");
const facility_enrolled_event_1 = require("../events/facility-enrolled.event");
const assign_master_facility_command_1 = require("../commands/assign-master-facility.command");
const manifest_logged_event_1 = require("../events/manifest-logged.event");
const initialize_summaries_command_1 = require("../commands/initialize-summaries-command");
let FacilityManifestSaga = class FacilityManifestSaga {
    constructor() {
        this.facilityEnrolled = (events$) => {
            return events$.pipe(cqrs_1.ofType(facility_enrolled_event_1.FacilityEnrolledEvent), operators_1.map(event => new assign_master_facility_command_1.AssignMasterFacilityCommand(event._id)));
        };
        this.manifestLogged = (events$) => {
            return events$.pipe(cqrs_1.ofType(manifest_logged_event_1.ManifestLoggedEvent), operators_1.map(event => new initialize_summaries_command_1.InitializeSummariesCommand(event.facilityId, event.manifestId)));
        };
    }
};
__decorate([
    cqrs_1.Saga(),
    __metadata("design:type", Object)
], FacilityManifestSaga.prototype, "facilityEnrolled", void 0);
__decorate([
    cqrs_1.Saga(),
    __metadata("design:type", Object)
], FacilityManifestSaga.prototype, "manifestLogged", void 0);
FacilityManifestSaga = __decorate([
    common_1.Injectable()
], FacilityManifestSaga);
exports.FacilityManifestSaga = FacilityManifestSaga;
//# sourceMappingURL=facility-manifest.saga.js.map
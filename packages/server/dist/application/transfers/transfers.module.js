"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const transfers_1 = require("../../infrastructure/transfers");
const update_stats_handler_1 = require("./commands/handlers/update-stats.handler");
const facility_manifest_saga_1 = require("./sagas/facility-manifest.saga");
const assign_master_facility_handler_1 = require("./commands/handlers/assign-master-facility.handler");
const initialize_summaries_handler_1 = require("./commands/handlers/initialize-summaries.handler");
const log_manifest_handler_1 = require("./commands/handlers/log-manifest.handler");
const registries_1 = require("../../infrastructure/registries");
const courts_1 = require("../../infrastructure/courts");
const get_stats_handler_1 = require("./queries/handlers/get-stats.handler");
const get_summary_handler_1 = require("./queries/handlers/get-summary.handler");
const facilities_controller_1 = require("./controllers/facilities.controller");
const messaging_module_1 = require("../../infrastructure/messging/messaging.module");
const CommandHandlers = [
    log_manifest_handler_1.LogManifestHandler,
    update_stats_handler_1.UpdateStatsHandler,
    assign_master_facility_handler_1.AssignMasterFacilityHandler,
    initialize_summaries_handler_1.InitializeSummariesHandler,
];
const QueryHandlers = [get_stats_handler_1.GetStatsHandler, get_summary_handler_1.GetSummaryHandler];
const Sagas = [facility_manifest_saga_1.FacilityManifestSaga];
let TransfersModule = class TransfersModule {
};
TransfersModule = __decorate([
    common_1.Module({
        imports: [
            cqrs_1.CqrsModule,
            messaging_module_1.MessagingModule,
            transfers_1.TransfersInfrastructureModule,
            registries_1.RegistriesInfrastructureModule,
            courts_1.CourtsInfrastructureModule,
        ],
        controllers: [facilities_controller_1.FacilitiesController],
        providers: [...CommandHandlers, ...QueryHandlers, ...Sagas],
    })
], TransfersModule);
exports.TransfersModule = TransfersModule;
//# sourceMappingURL=transfers.module.js.map
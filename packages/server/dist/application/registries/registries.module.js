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
const courts_infrastructure_module_1 = require("../../infrastructure/courts/courts-infrastructure.module");
const registries_infrastructure_module_1 = require("../../infrastructure/registries/registries-infrastructure.module");
const get_master_facilities_handler_1 = require("./queries/handlers/get-master-facilities.handler");
const get_dockets_handler_1 = require("../courts/queries/handlers/get-dockets.handler");
const master_facilities_controller_1 = require("./controllers/master-facilities.controller");
const save_master_facility_handler_1 = require("./commands/handlers/save-master-facility.handler");
const delete_master_facility_handler_1 = require("./commands/handlers/delete-master-facility.handler");
const master_facility_created_handler_1 = require("./events/handlers/master-facility-created.handler");
const master_facility_deleted_handler_1 = require("./events/handlers/master-facility-deleted.handler");
const master_facility_updated_handler_1 = require("./events/handlers/master-facility-updated.handler");
const messaging_module_1 = require("../../infrastructure/messging/messaging.module");
let RegistriesModule = class RegistriesModule {
};
RegistriesModule = __decorate([
    common_1.Module({
        imports: [
            cqrs_1.CqrsModule,
            messaging_module_1.MessagingModule,
            registries_infrastructure_module_1.RegistriesInfrastructureModule,
            courts_infrastructure_module_1.CourtsInfrastructureModule,
        ],
        controllers: [master_facilities_controller_1.MasterFacilitiesController],
        providers: [
            save_master_facility_handler_1.SaveMasterFacilityHandler,
            delete_master_facility_handler_1.DeleteMasterFacilityHandler,
            get_master_facilities_handler_1.GetMasterFacilitiesHandler,
            get_dockets_handler_1.GetDocketsHandler,
            master_facility_created_handler_1.MasterFacilityCreatedHandler,
            master_facility_deleted_handler_1.MasterFacilityDeletedHandler,
            master_facility_updated_handler_1.MasterFacilityUpdatedHandler,
        ],
    })
], RegistriesModule);
exports.RegistriesModule = RegistriesModule;
//# sourceMappingURL=registries.module.js.map
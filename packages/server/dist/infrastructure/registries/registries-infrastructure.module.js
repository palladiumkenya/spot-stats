"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const master_facility_schema_1 = require("./schemas/master-facility.schema");
const master_facility_repository_1 = require("./master-facility.repository");
const master_facility_1 = require("../../domain/registries/master-facility");
let RegistriesInfrastructureModule = class RegistriesInfrastructureModule {
};
RegistriesInfrastructureModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: master_facility_1.MasterFacility.name, schema: master_facility_schema_1.masterFacilitySchema }]),
        ],
        providers: [
            { provide: 'IMasterFacilityRepository', useClass: master_facility_repository_1.MasterFacilityRepository },
        ],
        exports: [
            { provide: 'IMasterFacilityRepository', useClass: master_facility_repository_1.MasterFacilityRepository },
        ],
    })
], RegistriesInfrastructureModule);
exports.RegistriesInfrastructureModule = RegistriesInfrastructureModule;
//# sourceMappingURL=registries-infrastructure.module.js.map
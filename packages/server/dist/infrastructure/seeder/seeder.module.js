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
const seed_reader_1 = require("./seed-reader");
const courts_infrastructure_module_1 = require("../courts/courts-infrastructure.module");
const master_facility_seeder_1 = require("./master-facility.seeder");
const docket_seeder_1 = require("./docket.seeder");
const registries_infrastructure_module_1 = require("../registries/registries-infrastructure.module");
const transfers_infrastructure_module_1 = require("../transfers/transfers-infrastructure.module");
let SeederModule = class SeederModule {
    constructor(docketSeeder, masterFacilitySeeder) {
        this.docketSeeder = docketSeeder;
        this.masterFacilitySeeder = masterFacilitySeeder;
    }
    async seedData() {
        await this.docketSeeder.seed();
        await this.masterFacilitySeeder.seed();
    }
};
SeederModule = __decorate([
    common_1.Module({
        imports: [courts_infrastructure_module_1.CourtsInfrastructureModule, registries_infrastructure_module_1.RegistriesInfrastructureModule,
            transfers_infrastructure_module_1.TransfersInfrastructureModule],
        providers: [
            seed_reader_1.SeedReader, master_facility_seeder_1.MasterFacilitySeeder, docket_seeder_1.DocketSeeder,
        ],
    }),
    __metadata("design:paramtypes", [docket_seeder_1.DocketSeeder,
        master_facility_seeder_1.MasterFacilitySeeder])
], SeederModule);
exports.SeederModule = SeederModule;
//# sourceMappingURL=seeder.module.js.map
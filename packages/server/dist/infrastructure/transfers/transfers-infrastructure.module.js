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
const facility_1 = require("../../domain/transfers/facility");
const facility_schema_1 = require("./schemas/facility.schema");
const manifest_1 = require("../../domain/transfers/manifest");
const summary_1 = require("../../domain/transfers/summary");
const summary_schema_1 = require("./schemas/summary.schema");
const mainifest_schema_1 = require("./schemas/mainifest.schema");
const facility_repository_1 = require("./facility.repository");
const manifest_repository_1 = require("./manifest.repository");
let TransfersInfrastructureModule = class TransfersInfrastructureModule {
};
TransfersInfrastructureModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: facility_1.Facility.name, schema: facility_schema_1.facilitySchema },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: manifest_1.Manifest.name, schema: mainifest_schema_1.manifestSchema },
            ]),
            mongoose_1.MongooseModule.forFeature([{ name: summary_1.Summary.name, schema: summary_schema_1.summarySchema }]),
        ],
        providers: [
            { provide: 'IFacilityRepository', useClass: facility_repository_1.FacilityRepository },
            { provide: 'IManifestRepository', useClass: manifest_repository_1.ManifestRepository },
        ],
        exports: [
            { provide: 'IFacilityRepository', useClass: facility_repository_1.FacilityRepository },
            { provide: 'IManifestRepository', useClass: manifest_repository_1.ManifestRepository },
        ],
    })
], TransfersInfrastructureModule);
exports.TransfersInfrastructureModule = TransfersInfrastructureModule;
//# sourceMappingURL=transfers-infrastructure.module.js.map
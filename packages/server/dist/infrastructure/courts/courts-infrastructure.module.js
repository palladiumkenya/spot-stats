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
const docket_1 = require("../../domain/courts/docket");
const docket_schema_1 = require("./schemas/docket.schema");
const docket_repository_1 = require("./docket.repository");
let CourtsInfrastructureModule = class CourtsInfrastructureModule {
};
CourtsInfrastructureModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: docket_1.Docket.name, schema: docket_schema_1.docketSchema }]),
        ],
        providers: [
            { provide: 'IDocketRepository', useClass: docket_repository_1.DocketRepository },
        ],
        exports: [
            { provide: 'IDocketRepository', useClass: docket_repository_1.DocketRepository },
        ],
    })
], CourtsInfrastructureModule);
exports.CourtsInfrastructureModule = CourtsInfrastructureModule;
//# sourceMappingURL=courts-infrastructure.module.js.map
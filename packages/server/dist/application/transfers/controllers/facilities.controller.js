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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const microservices_1 = require("@nestjs/microservices");
const get_summary_query_1 = require("../queries/get-summary.query");
const update_stats_command_1 = require("../commands/update-stats.command");
let FacilitiesController = class FacilitiesController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async getFacilityStats(id) {
        const result = await this.queryBus.execute(new get_summary_query_1.GetSummaryQuery(id));
        return result;
    }
    async handleUpdateStats(data) {
        common_1.Logger.log(`Recieved Stats ${data}`);
        return await this.commandBus.execute(new update_stats_command_1.UpdateStatsCommand(data.facilityCode, data.docket, data.stats, data.updated, data.manifestId));
    }
};
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FacilitiesController.prototype, "getFacilityStats", null);
__decorate([
    microservices_1.EventPattern('UpdateStatsEvent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FacilitiesController.prototype, "handleUpdateStats", null);
FacilitiesController = __decorate([
    common_1.Controller('facilities'),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], FacilitiesController);
exports.FacilitiesController = FacilitiesController;
//# sourceMappingURL=facilities.controller.js.map
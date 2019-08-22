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
const get_master_facilities_query_1 = require("../queries/get-master-facilities.query");
const save_master_facility_command_1 = require("../commands/save-master-facility.command");
const delete_master_facility_command_1 = require("../commands/delete-master-facility.command");
const microservices_1 = require("@nestjs/microservices");
let MasterFacilitiesController = class MasterFacilitiesController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async getMasterFacilities() {
        return this.queryBus.execute(new get_master_facilities_query_1.GetMasterFacilitiesQuery());
    }
    async createOrUpdateMasterFacility(docket) {
        return this.commandBus.execute(new save_master_facility_command_1.SaveMasterFacilityCommand(docket.code, docket.name, docket._id, docket.county, docket.mechanism));
    }
    async deleteMasterFacility(id) {
        return this.commandBus.execute(new delete_master_facility_command_1.DeleteMasterFacilityCommand(id));
    }
    async handleUpdated(data) {
        common_1.Logger.log(`Recieved Updates ${data}`);
        return await this.commandBus.execute(new save_master_facility_command_1.SaveMasterFacilityCommand(data._id, data.code, data.name, data.county, data.mechanism));
    }
    async handleCreated(data) {
        common_1.Logger.log(`Recieved New ${data}`);
        return await this.commandBus.execute(new save_master_facility_command_1.SaveMasterFacilityCommand(data._id, data.code, data.name, data.county, data.mechanism));
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MasterFacilitiesController.prototype, "getMasterFacilities", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MasterFacilitiesController.prototype, "createOrUpdateMasterFacility", null);
__decorate([
    common_1.Delete(':_id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MasterFacilitiesController.prototype, "deleteMasterFacility", null);
__decorate([
    microservices_1.EventPattern('FacilityUpdatedEvent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MasterFacilitiesController.prototype, "handleUpdated", null);
__decorate([
    microservices_1.EventPattern('FacilityCreatedEvent '),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MasterFacilitiesController.prototype, "handleCreated", null);
MasterFacilitiesController = __decorate([
    common_1.Controller('masterfacilities'),
    __metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], MasterFacilitiesController);
exports.MasterFacilitiesController = MasterFacilitiesController;
//# sourceMappingURL=master-facilities.controller.js.map
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
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const delete_master_facility_command_1 = require("../delete-master-facility.command");
const master_facility_deleted_event_1 = require("../../events/master-facility-deleted.event");
let DeleteMasterFacilityHandler = class DeleteMasterFacilityHandler {
    constructor(repository, eventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const result = await this.repository.delete(command._id);
        if (result) {
            this.eventBus.publish(new master_facility_deleted_event_1.MasterFacilityDeletedEvent(command._id));
            return true;
        }
        return false;
    }
};
DeleteMasterFacilityHandler = __decorate([
    cqrs_1.CommandHandler(delete_master_facility_command_1.DeleteMasterFacilityCommand),
    __param(0, common_1.Inject('IMasterFacilityRepository')),
    __metadata("design:paramtypes", [Object, cqrs_1.EventBus])
], DeleteMasterFacilityHandler);
exports.DeleteMasterFacilityHandler = DeleteMasterFacilityHandler;
//# sourceMappingURL=delete-master-facility.handler.js.map
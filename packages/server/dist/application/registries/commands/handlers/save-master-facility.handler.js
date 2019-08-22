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
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
const save_master_facility_command_1 = require("../save-master-facility.command");
const master_facility_1 = require("../../../../domain/registries/master-facility");
const uuid = require("uuid");
let SaveMasterFacilityHandler = class SaveMasterFacilityHandler {
    constructor(repository, publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }
    async execute(command) {
        if (command._id && command._id !== '00000000-0000-0000-0000-000000000000') {
            return await this.updateMasterFacility(command);
        }
        return await this.createMasterFacility(command);
    }
    async createMasterFacility(command) {
        const newMasterFacility = new master_facility_1.MasterFacility(command._id, command.code, command.name, command.county, command.mechanism);
        if (!command._id) {
            newMasterFacility._id = uuid.v1();
        }
        const masterFacility = await this.repository.create(newMasterFacility);
        this.publisher.mergeObjectContext(newMasterFacility).commit();
        return masterFacility;
    }
    async updateMasterFacility(command) {
        const raw = await this.repository.get(command._id);
        if (raw) {
            const toUptate = class_transformer_1.plainToClass(master_facility_1.MasterFacility, raw);
            toUptate.changeDetails(command.code, command.name, command.county, command.mechanism);
            const masterFacility = await this.repository.update(toUptate);
            this.publisher.mergeObjectContext(toUptate).commit();
            return masterFacility;
        }
        else {
            this.createMasterFacility(command);
        }
    }
};
SaveMasterFacilityHandler = __decorate([
    cqrs_1.CommandHandler(save_master_facility_command_1.SaveMasterFacilityCommand),
    __param(0, common_1.Inject('IMasterFacilityRepository')),
    __metadata("design:paramtypes", [Object, cqrs_1.EventPublisher])
], SaveMasterFacilityHandler);
exports.SaveMasterFacilityHandler = SaveMasterFacilityHandler;
//# sourceMappingURL=save-master-facility.handler.js.map
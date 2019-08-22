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
const assign_master_facility_command_1 = require("../assign-master-facility.command");
const common_1 = require("@nestjs/common");
const domain_1 = require("../../../../domain");
const class_transformer_1 = require("class-transformer");
let AssignMasterFacilityHandler = class AssignMasterFacilityHandler {
    constructor(masterFacilityRepository, facilityRepository, publisher) {
        this.masterFacilityRepository = masterFacilityRepository;
        this.facilityRepository = facilityRepository;
        this.publisher = publisher;
    }
    async execute(command) {
        let facility = await this.facilityRepository.get(command._id);
        if (facility) {
            facility = class_transformer_1.plainToClass(domain_1.Facility, facility);
            if (facility.masterFacility) {
                return facility;
            }
            else {
                const masterFacility = await this.masterFacilityRepository.findByCode(facility.code);
                if (masterFacility) {
                    facility.assignMasterFacility(masterFacility);
                    const updatedFacility = await this.facilityRepository.update(facility);
                    this.publisher.mergeObjectContext(facility).commit();
                    return updatedFacility;
                }
            }
        }
        return null;
    }
};
AssignMasterFacilityHandler = __decorate([
    cqrs_1.CommandHandler(assign_master_facility_command_1.AssignMasterFacilityCommand),
    __param(0, common_1.Inject('IMasterFacilityRepository')),
    __param(1, common_1.Inject('IFacilityRepository')),
    __metadata("design:paramtypes", [Object, Object, cqrs_1.EventPublisher])
], AssignMasterFacilityHandler);
exports.AssignMasterFacilityHandler = AssignMasterFacilityHandler;
//# sourceMappingURL=assign-master-facility.handler.js.map
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
const domain_1 = require("../../../../domain");
const update_stats_command_1 = require("../update-stats.command");
const class_transformer_1 = require("class-transformer");
let UpdateStatsHandler = class UpdateStatsHandler {
    constructor(docketRepository, facilityRepository, publisher) {
        this.docketRepository = docketRepository;
        this.facilityRepository = facilityRepository;
        this.publisher = publisher;
    }
    async execute(command) {
        let facility = await this.facilityRepository.findByCode(command.facilityCode);
        if (facility) {
            facility = class_transformer_1.plainToClass(domain_1.Facility, facility);
            facility.updateSummary(command.docket, command.stats, command.updated);
            const updatedFacility = await this.facilityRepository.update(facility);
            this.publisher.mergeObjectContext(facility).commit();
            return updatedFacility;
        }
        return null;
    }
};
UpdateStatsHandler = __decorate([
    cqrs_1.CommandHandler(update_stats_command_1.UpdateStatsCommand),
    __param(0, common_1.Inject('IDocketRepository')),
    __param(1, common_1.Inject('IFacilityRepository')),
    __metadata("design:paramtypes", [Object, Object, cqrs_1.EventPublisher])
], UpdateStatsHandler);
exports.UpdateStatsHandler = UpdateStatsHandler;
//# sourceMappingURL=update-stats.handler.js.map
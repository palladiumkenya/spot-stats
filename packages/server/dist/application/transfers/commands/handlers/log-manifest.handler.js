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
const uuid = require("uuid");
const log_manifest_command_1 = require("../log-manifest.command");
const class_transformer_1 = require("class-transformer");
let LogManifestHandler = class LogManifestHandler {
    constructor(masterFacilityRepository, docketRepository, facilityRepository, manifestRepository, publisher) {
        this.masterFacilityRepository = masterFacilityRepository;
        this.docketRepository = docketRepository;
        this.facilityRepository = facilityRepository;
        this.manifestRepository = manifestRepository;
        this.publisher = publisher;
    }
    async execute(command) {
        const manifestExists = await this.manifestRepository.get(command.id);
        if (manifestExists) {
            return;
        }
        const facility = await this.enrollFacility(command);
        const newManifest = this.createManifest(command);
        if (facility) {
            newManifest.assignFacility(facility);
            facility.addManifest(newManifest._id);
        }
        const manifest = await this.manifestRepository.create(newManifest);
        this.publisher.mergeObjectContext(newManifest).commit();
        const enrolledFacility = await this.facilityRepository.update(facility);
        this.publisher.mergeObjectContext(facility).commit();
        return newManifest;
    }
    async enrollFacility(command) {
        const facility = await this.facilityRepository.findByCode(command.facilityCode);
        if (facility) {
            return class_transformer_1.plainToClass(domain_1.Facility, facility);
        }
        const newFacility = new domain_1.Facility(uuid.v1(), command.facilityCode, command.facilityName);
        const masterFacility = await this.masterFacilityRepository.findByCode(command.facilityCode);
        if (masterFacility) {
            newFacility.masterFacility = masterFacility;
        }
        const enrolledFacility = await this.facilityRepository.create(newFacility);
        this.publisher.mergeObjectContext(newFacility).commit();
        return newFacility;
    }
    createManifest(command) {
        const manifest = new domain_1.Manifest(command.id, command.facilityCode, command.facilityName, command.logDate, command.buildDate, command.docket, command.patientCount, command.cargo, command.isCurrent);
        return manifest;
    }
};
LogManifestHandler = __decorate([
    cqrs_1.CommandHandler(log_manifest_command_1.LogManifestCommand),
    __param(0, common_1.Inject('IMasterFacilityRepository')),
    __param(1, common_1.Inject('IDocketRepository')),
    __param(2, common_1.Inject('IFacilityRepository')),
    __param(3, common_1.Inject('IManifestRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, cqrs_1.EventPublisher])
], LogManifestHandler);
exports.LogManifestHandler = LogManifestHandler;
//# sourceMappingURL=log-manifest.handler.js.map
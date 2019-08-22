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
const initialize_summaries_command_1 = require("../initialize-summaries-command");
const common_1 = require("@nestjs/common");
const domain_1 = require("../../../../domain");
const class_transformer_1 = require("class-transformer");
let InitializeSummariesHandler = class InitializeSummariesHandler {
    constructor(facilityRepository, docketRepository, publisher) {
        this.facilityRepository = facilityRepository;
        this.docketRepository = docketRepository;
        this.publisher = publisher;
    }
    async execute(command) {
        let facility = await this.facilityRepository.get(command.facilityId);
        if (facility) {
            facility = class_transformer_1.plainToClass(domain_1.Facility, facility);
            const manifest = facility.manifests.find(m => m.mId === command.manifestId);
            if (manifest) {
                let docket = await this.docketRepository.findByName(manifest.docket);
                if (docket && docket.extracts && docket.extracts.length > 0) {
                    docket = class_transformer_1.plainToClass(domain_1.Docket, docket);
                    const extracts = docket.extracts.sort((a, b) => a.rank - b.rank);
                    extracts.forEach(e => {
                        if (!facility.summaryHasExtract(e._id)) {
                            const summary = new domain_1.Summary({ id: docket._id, name: docket.name, display: docket.display }, e);
                            if (e.isPatient) {
                                summary.expected = manifest.patientCount;
                                summary.recieved = 0;
                                summary.updated = new Date();
                            }
                            facility.addSummary(summary);
                        }
                        else {
                            if (e.isPatient) {
                                facility.resetSummary(e._id, manifest.patientCount, new Date());
                            }
                            else {
                                facility.resetSummary(e._id, null, new Date());
                            }
                        }
                    });
                    const updatedFacility = await this.facilityRepository.update(facility);
                    this.publisher.mergeObjectContext(facility).commit();
                }
            }
        }
    }
};
InitializeSummariesHandler = __decorate([
    cqrs_1.CommandHandler(initialize_summaries_command_1.InitializeSummariesCommand),
    __param(0, common_1.Inject('IFacilityRepository')),
    __param(1, common_1.Inject('IDocketRepository')),
    __metadata("design:paramtypes", [Object, Object, cqrs_1.EventPublisher])
], InitializeSummariesHandler);
exports.InitializeSummariesHandler = InitializeSummariesHandler;
//# sourceMappingURL=initialize-summaries.handler.js.map
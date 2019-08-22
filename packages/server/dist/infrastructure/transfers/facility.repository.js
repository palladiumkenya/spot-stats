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
var _a;
const base_repository_1 = require("../common/base.repository");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const facility_1 = require("../../domain/transfers/facility");
let FacilityRepository = class FacilityRepository extends base_repository_1.BaseRepository {
    constructor(model) {
        super(model);
    }
    async findByCode(code) {
        const facilty = await this.model.find({ code }).exec();
        if (facilty && facilty.length > 0) {
            return facilty[0].toObject();
        }
        return undefined;
    }
    async manifestExists(id) {
        const facility = await this.model
            .find({ 'manifests.mId': id })
            .populate('manifests')
            .exec();
        return facility && facility.length > 0;
    }
};
FacilityRepository = __decorate([
    __param(0, mongoose_1.InjectModel(facility_1.Facility.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], FacilityRepository);
exports.FacilityRepository = FacilityRepository;
//# sourceMappingURL=facility.repository.js.map
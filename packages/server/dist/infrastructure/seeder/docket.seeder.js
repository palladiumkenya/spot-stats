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
const seed_reader_1 = require("./seed-reader");
const class_transformer_1 = require("class-transformer");
const docket_1 = require("../../domain/courts/docket");
let DocketSeeder = class DocketSeeder {
    constructor(reader, repository) {
        this.reader = reader;
        this.repository = repository;
    }
    async load() {
        const seedData = await this.reader.read(docket_1.Docket.name.toLowerCase());
        const dockets = class_transformer_1.deserializeArray(docket_1.Docket, seedData);
        return dockets;
    }
    async seed() {
        const seedData = await this.load();
        const count = await this.repository.getCount();
        if (count === 0) {
            common_1.Logger.log(`Seeding ${docket_1.Docket.name}(s)...`);
            await this.repository.createBatch(seedData);
            return seedData.length;
        }
        return 0;
    }
};
DocketSeeder = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject('IDocketRepository')),
    __metadata("design:paramtypes", [seed_reader_1.SeedReader, Object])
], DocketSeeder);
exports.DocketSeeder = DocketSeeder;
//# sourceMappingURL=docket.seeder.js.map
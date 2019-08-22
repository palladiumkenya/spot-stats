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
const save_docket_command_1 = require("../save-docket.command");
const cqrs_1 = require("@nestjs/cqrs");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
const docket_1 = require("../../../../domain/courts/docket");
let SaveDocketHandler = class SaveDocketHandler {
    constructor(repository, publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }
    async execute(command) {
        if (command._id && command._id !== '00000000-0000-0000-0000-000000000000') {
            return await this.updateDocket(command);
        }
        return await this.createDocket(command);
    }
    async createDocket(command) {
        const newDocket = new docket_1.Docket(command.name, command.display);
        const docket = await this.repository.create(newDocket);
        this.publisher.mergeObjectContext(newDocket).commit();
        return docket;
    }
    async updateDocket(command) {
        const raw = await this.repository.get(command._id);
        if (raw) {
            const docketToUpdate = class_transformer_1.plainToClass(docket_1.Docket, raw);
            docketToUpdate.changeDetails(command.name, command.display);
            const docket = await this.repository.update(docketToUpdate);
            this.publisher.mergeObjectContext(docketToUpdate).commit();
            return docket;
        }
    }
};
SaveDocketHandler = __decorate([
    cqrs_1.CommandHandler(save_docket_command_1.SaveDocketCommand),
    __param(0, common_1.Inject('IDocketRepository')),
    __metadata("design:paramtypes", [Object, cqrs_1.EventPublisher])
], SaveDocketHandler);
exports.SaveDocketHandler = SaveDocketHandler;
//# sourceMappingURL=save-docket.handler.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const get_dockets_handler_1 = require("./queries/handlers/get-dockets.handler");
const dockets_controller_1 = require("./controllers/dockets.controller");
const save_docket_handler_1 = require("./commands/handlers/save-docket.handler");
const delete_docket_handler_1 = require("./commands/handlers/delete-docket.handler");
const docket_created_handler_1 = require("./events/handlers/docket-created.handler");
const docket_deleted_handler_1 = require("./events/handlers/docket-deleted.handler");
const docket_updated_handler_1 = require("./events/handlers/docket-updated.handler");
const courts_infrastructure_module_1 = require("../../infrastructure/courts/courts-infrastructure.module");
const messaging_module_1 = require("../../infrastructure/messging/messaging.module");
let CourtsModule = class CourtsModule {
};
CourtsModule = __decorate([
    common_1.Module({
        imports: [cqrs_1.CqrsModule, messaging_module_1.MessagingModule, courts_infrastructure_module_1.CourtsInfrastructureModule],
        controllers: [dockets_controller_1.DocketsController],
        providers: [
            save_docket_handler_1.SaveDocketHandler,
            delete_docket_handler_1.DeleteDocketHandler,
            get_dockets_handler_1.GetDocketsHandler,
            docket_created_handler_1.DocketCreatedEventHandler,
            docket_deleted_handler_1.DocketDeletedEventHandler,
            docket_updated_handler_1.DocketUpdatedEventHandler,
        ],
    })
], CourtsModule);
exports.CourtsModule = CourtsModule;
//# sourceMappingURL=courts.module.js.map
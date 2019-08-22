"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registries_1 = require("./application/registries");
const transfers_module_1 = require("./application/transfers/transfers.module");
const courts_module_1 = require("./application/courts/courts.module");
exports.routes = [
    {
        path: 'api/v1/registries',
        module: registries_1.RegistriesModule,
    },
    {
        path: 'api/v1/transfers',
        module: transfers_module_1.TransfersModule,
    },
    {
        path: 'api/v1/courts',
        module: courts_module_1.CourtsModule,
    },
];
//# sourceMappingURL=routes.js.map
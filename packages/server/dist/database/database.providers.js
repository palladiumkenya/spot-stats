"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("@nestjs/mongoose");
const config_service_1 = require("../config/config.service");
const config_module_1 = require("../config/config.module");
exports.databaseProviders = [
    mongoose_1.MongooseModule.forRootAsync({
        imports: [config_module_1.ConfigModule],
        inject: [config_service_1.ConfigService],
        useFactory: async (config) => ({
            uri: config.Database,
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
        }),
    }),
];
//# sourceMappingURL=database.providers.js.map
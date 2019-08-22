"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const seeder_1 = require("./infrastructure/seeder");
const common_1 = require("@nestjs/common");
const config_service_1 = require("./config/config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_service_1.ConfigService);
    const microservice = app.connectMicroservice(config.QueueConfig);
    app.enableCors();
    const seeder = app.get(seeder_1.SeederModule);
    await seeder.seedData();
    await app.listen(config.Port);
    await app.startAllMicroservicesAsync().catch(e => common_1.Logger.error(e));
}
bootstrap();
//# sourceMappingURL=main.js.map
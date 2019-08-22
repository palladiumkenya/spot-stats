"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const Joi = require("@hapi/joi");
const fs = require("fs");
const microservices_1 = require("@nestjs/microservices");
class ConfigService {
    constructor(filePath) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        this.envConfig = this.validateInput(config);
    }
    validateInput(envConfig) {
        const envVarsSchema = Joi.object({
            NODE_ENV: Joi.string()
                .valid(['development', 'production', 'test', 'provision'])
                .default('development'),
            STATS_PORT: Joi.number().default(4720),
            STATS_RABBITMQ_HOST: Joi.string().default('amqp://localhost:5672/spot'),
            STATS_RABBITMQ_USER: Joi.string().default('guest'),
            STATS_RABBITMQ_PASS: Joi.string().default('guest'),
            STATS_RABBITMQ_QUEUE: Joi.string().default('stats_queue'),
            STATS_MONGODB_URI: Joi.string().default('mongodb://localhost/dwapiStats'),
        });
        const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }
    get Port() {
        return Number(this.envConfig.STATS_PORT);
    }
    get QueueHost() {
        return String(this.envConfig.STATS_RABBITMQ_HOST);
    }
    get QueueUser() {
        return String(this.envConfig.STATS_RABBITMQ_USER);
    }
    get QueuePassword() {
        return String(this.envConfig.STATS_RABBITMQ_PASS);
    }
    get QueueName() {
        return String(this.envConfig.STATS_RABBITMQ_QUEUE);
    }
    get Database() {
        return String(this.envConfig.GLOBE_MONGODB_URI);
    }
    get QueueConfig() {
        return {
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [this.QueueHost],
                queue: this.QueueName,
                queueOptions: { durable: true },
            },
        };
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map
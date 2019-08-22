export interface EnvConfig {
    [key: string]: string;
}
export declare class ConfigService {
    private readonly envConfig;
    constructor(filePath: string);
    private validateInput;
    readonly Port: number;
    readonly QueueHost: string;
    readonly QueueUser: string;
    readonly QueuePassword: string;
    readonly QueueName: string;
    readonly Database: string;
    readonly QueueConfig: any;
}

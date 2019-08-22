export declare class LogManifestCommand {
    id: string;
    facilityCode: number;
    facilityName: string;
    docket: string;
    logDate: Date;
    buildDate: Date;
    patientCount: number;
    cargo: string;
    constructor(id: string, facilityCode: number, facilityName: string, docket: string, logDate: Date, buildDate: Date, patientCount: number, cargo: string);
}

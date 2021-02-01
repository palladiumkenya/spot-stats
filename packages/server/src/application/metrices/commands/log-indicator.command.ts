export class LogIndicatorCommand {
    constructor(
        public _id: string,
        public facilityCode: number,
        public facilityName: string,
        public name: string,
        public value: string,
        public indicatorDate: Date,
        public stage: string,
        public facilityManifestId: string,
        public dwhValue?: string,
        public dwhIndicatorDate?: Date,
    ) {}
}

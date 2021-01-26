export class LogIndicatorCommand {
    constructor(
        public _id: string,
        public name: string,
        public value: string,
        public indicatorDate: Date,
        public stage: string,
        public facility: any,
        public mId: string,
    ) {}
}

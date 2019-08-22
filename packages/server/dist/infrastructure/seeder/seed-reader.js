"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fg = require("fast-glob");
const fs = require("fs");
const common_1 = require("@nestjs/common");
class SeedReader {
    constructor() {
        this.pattern = '**/*.seed.json';
    }
    async getFiles() {
        let files = [];
        files = await fg([this.pattern], { dot: true });
        return files;
    }
    async read(fileMatch) {
        const seedFiles = await this.getFiles();
        const fileToParse = seedFiles.find(f => f.includes(fileMatch.toLowerCase()));
        if (fileToParse) {
            common_1.Logger.log(`reading seed [${fileToParse}]`);
            const contents = fs.readFileSync(fileToParse).toString();
            return contents;
        }
        return '';
    }
}
exports.SeedReader = SeedReader;
//# sourceMappingURL=seed-reader.js.map
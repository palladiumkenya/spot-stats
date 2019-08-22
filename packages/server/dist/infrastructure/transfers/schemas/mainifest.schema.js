"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
exports.manifestSchema = new mongoose.Schema({
    _id: String,
    mId: String,
    logDate: Date,
    buildDate: Date,
    docket: String,
    patientCount: Number,
    cargo: [mongoose_1.Schema.Types.Mixed],
});
//# sourceMappingURL=mainifest.schema.js.map
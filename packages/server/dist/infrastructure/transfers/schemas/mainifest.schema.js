"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const domain_1 = require("../../../domain");
exports.manifestSchema = new mongoose.Schema({
    _id: String,
    mId: String,
    code: Number,
    name: String,
    facility: { type: String, ref: domain_1.Facility.name },
    facilityInfo: mongoose_1.Schema.Types.Mixed,
    logDate: Date,
    buildDate: Date,
    docket: String,
    patientCount: Number,
    recievedCount: Number,
    recievedDate: Date,
    cargo: [mongoose_1.Schema.Types.Mixed],
    isCurrent: Boolean,
});
//# sourceMappingURL=mainifest.schema.js.map
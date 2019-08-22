"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
exports.masterFacilitySchema = new mongoose.Schema({
    _id: String,
    code: Number,
    name: String,
    county: mongoose_1.Schema.Types.Mixed,
    mechanism: mongoose_1.Schema.Types.Mixed,
});
//# sourceMappingURL=master-facility.schema.js.map
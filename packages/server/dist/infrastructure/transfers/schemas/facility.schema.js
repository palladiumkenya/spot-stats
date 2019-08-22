"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mainifest_schema_1 = require("./mainifest.schema");
const summary_schema_1 = require("./summary.schema");
const master_facility_schema_1 = require("../../registries/schemas/master-facility.schema");
exports.facilitySchema = new mongoose.Schema({
    _id: String,
    code: Number,
    name: String,
    manifests: [mainifest_schema_1.manifestSchema],
    summaries: [summary_schema_1.summarySchema],
    masterFacility: master_facility_schema_1.masterFacilitySchema,
});
//# sourceMappingURL=facility.schema.js.map
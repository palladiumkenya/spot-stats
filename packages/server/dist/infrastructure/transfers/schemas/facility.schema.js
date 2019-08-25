"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const summary_schema_1 = require("./summary.schema");
const master_facility_schema_1 = require("../../registries/schemas/master-facility.schema");
const domain_1 = require("../../../domain");
exports.facilitySchema = new mongoose.Schema({
    _id: String,
    code: Number,
    name: String,
    manifests: [{ type: String, ref: domain_1.Manifest.name }],
    summaries: [summary_schema_1.summarySchema],
    masterFacility: master_facility_schema_1.masterFacilitySchema,
});
//# sourceMappingURL=facility.schema.js.map
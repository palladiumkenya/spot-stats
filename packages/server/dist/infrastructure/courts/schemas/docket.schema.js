"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const extract_schema_1 = require("./extract.schema");
exports.docketSchema = new mongoose.Schema({
    _id: String,
    name: String,
    display: String,
    extracts: [extract_schema_1.extractSchema],
});
//# sourceMappingURL=docket.schema.js.map
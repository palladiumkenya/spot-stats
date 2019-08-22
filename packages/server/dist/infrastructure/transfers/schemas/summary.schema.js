"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
exports.summarySchema = new mongoose.Schema({
    _id: String,
    docket: mongoose_1.Schema.Types.Mixed,
    extract: mongoose_1.Schema.Types.Mixed,
    expected: Number,
    recieved: Number,
    updated: Date,
});
//# sourceMappingURL=summary.schema.js.map
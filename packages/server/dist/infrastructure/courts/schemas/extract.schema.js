"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.extractSchema = new mongoose.Schema({
    _id: String,
    name: String,
    isPatient: Boolean,
    display: String,
    rank: Number,
});
//# sourceMappingURL=extract.schema.js.map
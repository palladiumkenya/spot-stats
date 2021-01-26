import * as mongoose from 'mongoose';

export const indicatorSchema = new mongoose.Schema({
    _id: String,
    name: String,
    value: String,
    indicatorDate: Date,
    stage: String,
    facility: Object,
    mId: String,
});

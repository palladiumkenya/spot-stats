import * as mongoose from 'mongoose';
import { Facility } from '../../../domain';

export const indicatorSchema = new mongoose.Schema({
    _id: String,
    name: String,
    value: String,
    indicatorDate: Date,
    facility: { type: String, ref: Facility.name },
    createDate: Date,
    facilityManifestId: String,
    dwhValue: String,
    dwhIndicatorDate: Date,
});

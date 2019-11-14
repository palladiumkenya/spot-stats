import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Facility, Manifest } from '../../../domain';

export const metricSchema = new mongoose.Schema({
  _id: String,
  measure: [{ type: String, ref: Facility.name }],
  facility: [{ type: String, ref: Facility.name }],
  report: Schema.Types.Mixed,
});

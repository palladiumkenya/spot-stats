import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Facility, Manifest } from '../../../domain';
import { Measure } from '../../../domain/metrices/measure';

export const metricSchema = new mongoose.Schema({
  _id: String,
  mId: String,
  measure: { type: String, ref: Measure.name },
  facility: { type: String, ref: Facility.name },
  report: Schema.Types.Mixed,
  facilityManifestId: String,
});

import * as mongoose from 'mongoose';
import { summarySchema } from './summary.schema';
import { masterFacilitySchema } from '../../registries/schemas/master-facility.schema';
import { Facility, Manifest } from '../../../domain';
import { Metric } from '../../../domain/metrices/metric';

export const facilitySchema = new mongoose.Schema({
  _id: String,
  code: Number,
  name: String,
  manifests: [{ type: String, ref: Manifest.name }],
  summaries: [summarySchema],
  masterFacility: masterFacilitySchema,
  metrics: [{ type: String, ref: Metric.name }],
});

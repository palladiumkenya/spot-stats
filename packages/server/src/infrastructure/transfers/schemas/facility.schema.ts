import * as mongoose from 'mongoose';
import { manifestSchema } from './mainifest.schema';
import { summarySchema } from './summary.schema';
import { masterFacilitySchema } from '../../registries/schemas/master-facility.schema';

export const facilitySchema = new mongoose.Schema({
  _id: String,
  code: Number,
  name: String,
  manifests: [manifestSchema],
  summaries: [summarySchema],
  masterFacility: masterFacilitySchema,
});

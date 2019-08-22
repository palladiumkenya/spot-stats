import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const masterFacilitySchema = new mongoose.Schema({
  _id: String,
  code: Number,
  name: String,
  county: Schema.Types.Mixed,
  mechanism: Schema.Types.Mixed,
});

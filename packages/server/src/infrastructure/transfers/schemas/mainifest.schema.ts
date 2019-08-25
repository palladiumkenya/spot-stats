import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Facility } from '../../../domain';

export const manifestSchema = new mongoose.Schema({
  _id: String,
  mId: String,
  code: Number,
  name: String,
  facility: { type: String, ref: Facility.name },
  logDate: Date,
  buildDate: Date,
  docket: String,
  patientCount: Number,
  cargo: [Schema.Types.Mixed],
  isCurrent: Boolean,
});

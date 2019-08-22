import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const manifestSchema = new mongoose.Schema({
  _id: String,
  mId: String,
  logDate: Date,
  buildDate: Date,
  docket: String,
  patientCount: Number,
  cargo: [Schema.Types.Mixed],
});

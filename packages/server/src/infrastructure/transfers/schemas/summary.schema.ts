import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { extractSchema } from '../../courts';

export const summarySchema = new mongoose.Schema({
  _id: String,
  docket: Schema.Types.Mixed,
  extract: Schema.Types.Mixed,
  expected: Number,
  recieved: Number,
  updated: Date,
});

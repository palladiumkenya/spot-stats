import * as mongoose from 'mongoose';
import { extractSchema } from './extract.schema';

export const docketSchema = new mongoose.Schema({
  _id: String,
  name: String,
  display: String,
  extracts: [extractSchema],
});

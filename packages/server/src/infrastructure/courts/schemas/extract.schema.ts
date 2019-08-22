import * as mongoose from 'mongoose';

export const extractSchema = new mongoose.Schema({
  _id: String,
  name: String,
  isPatient: Boolean,
  display: String,
  rank: Number,
});

import * as mongoose from 'mongoose';

export const measureSchema = new mongoose.Schema({
  _id: String,
  name: String,
  area: String,
  display: String,
  description: String,
  rank: Number,
});

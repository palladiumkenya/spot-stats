import * as mongoose from 'mongoose';

export const noticeBoardSchema = new mongoose.Schema({
  _id: String,
  rank: Number,
  message: String,
});

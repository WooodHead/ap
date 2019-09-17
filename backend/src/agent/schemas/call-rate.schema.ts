import * as mongoose from 'mongoose';

export const callRateSchema = new mongoose.Schema({
  agent: String,
  extension: String,
  rate: Number,
  mode: String,
  number: String,
  duration: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

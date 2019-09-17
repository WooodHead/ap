import * as mongoose from 'mongoose';

export const sessionSchema = new mongoose.Schema({
  agent: String,
  extension: String,
  sid: String,
});

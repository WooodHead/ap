import * as mongoose from 'mongoose';

export const pauseTypeSchema = new mongoose.Schema(
  {
    pauseCode: String,
    pauseReason: String,
  },
  { collection: 'pauseTypes' },
);

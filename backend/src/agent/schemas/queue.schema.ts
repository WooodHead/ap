import * as mongoose from 'mongoose';

export const queueSchema = new mongoose.Schema(
  {
    Queue: String,
    WaitingCalls: Number,
  },
  {
    collection: 'queue',
  },
);

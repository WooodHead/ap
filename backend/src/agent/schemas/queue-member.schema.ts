import * as mongoose from 'mongoose';

export const queueMemberSchema = new mongoose.Schema(
  {
    Queue: String,
    QueueMember: String,
    Extension: String,
  },
  {
    collection: 'queueMember',
  },
);

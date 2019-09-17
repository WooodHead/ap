import * as mongoose from 'mongoose';

export const contactsSchema = new mongoose.Schema({
  agentId: {
    type: String,
    required: true,
  },

  firstName: String,
  lastName: String,
  note: String,

  number: {
    type: String,
    required: true,
  },

  isFavorite: {
    type: Boolean,
    default: false,
  },
});

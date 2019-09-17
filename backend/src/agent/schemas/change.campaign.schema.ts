import * as mongoose from 'mongoose';

export const changeCampaignSchema = new mongoose.Schema(
  {
    active: Boolean,
    userGroup: { type: String, index: true },
    campaigns: [String],
    statsPeriod: String,
    nextCampaign: {
      sortBy: String,
      sortOrder: String,
      sortTimeCalc: String,
    },
    changeConditions: {
      type: [{
        type: { type: String, enum: ['time', 'calls'] },
        config: mongoose.Schema.Types.Mixed,
      }],
      default: [{
        type: 'time',
        config: {
          limits: {},
        },
      }],
    },
    changeConditionSatisfy: String,
  },
  { collection: 'change_campaign', minimize: false },
);

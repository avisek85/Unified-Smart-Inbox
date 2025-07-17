const mongoose = require("mongoose");
const { Schema } = mongoose;

const threadSummarySchema = new Schema({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: "Contact",
    required: true,
    unique: true,
  },
  summaryText: { type: String },
  tipsText: { type: String },
  churnRisk: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ThreadSummary", threadSummarySchema);

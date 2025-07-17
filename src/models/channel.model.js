const mongoose = require("mongoose");
const { Schema } = mongoose;

const channelSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["whatsapp", "gmail", "linkedin", "facebook"],
    required: true,
  },
  name: { type: String }, // Friendly name
  config: { type: Schema.Types.Mixed }, // Tokens, page IDs, etc.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Channel", channelSchema);

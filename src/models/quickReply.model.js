const mongoose = require("mongoose");
const { Schema } = mongoose;

const quickReplySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuickReply", quickReplySchema);

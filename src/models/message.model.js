const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  contactId: {
    type: Schema.Types.ObjectId,
    ref: "Contact",
    required: true,
    index: true,
  },
  channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
  direction: { type: String, enum: ["incoming", "outgoing"], required: true },
  content: { type: String },
  attachments: [{ type: String }], // URLs
  timestamp: { type: Date, default: Date.now },
});

messageSchema.index({ contactId: 1, timestamp: -1 }); // fast conversation loading

module.exports = mongoose.model("Message", messageSchema);

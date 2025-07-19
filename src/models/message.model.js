/**
 * Model: Message
 * Represents each incoming or outgoing message linked to contact & channel
 */

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    direction: {
      type: String,
      enum: ["incoming", "outgoing"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        url: String,
        type: String, // image, video, pdf, etc.
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup: show latest messages in inbox
messageSchema.index({ userId: 1, contactId: 1, timestamp: -1 });

module.exports = mongoose.model("Message", messageSchema);

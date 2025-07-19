/**
 * Model: Contact
 * Represents a customer/user who interacts via a channel
 */

const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    name: {
      type: String,
      default: "Unknown",
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    currentTag: {
      type: String,
      enum: ["lead", "support", "spam", "opportunity"],
      default: "lead",
    },
    lastMessageAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries per user
contactSchema.index({ userId: 1, channelId: 1 });

module.exports = mongoose.model("Contact", contactSchema);

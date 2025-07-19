/**
 * Model: Channel
 * Represents a communication channel (WhatsApp, Gmail, LinkedIn, etc.) linked to a user
 */

const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["whatsapp", "facebook", "instagram", "linkedin", "email"], // can add more
  },
  name: {
    type: String,
    default: "",
  },
  config: {
    type: mongoose.Schema.Types.Mixed, // flexible: store phoneNumberId, tokens, etc.
    default: {},
  },
  status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Channel", channelSchema);

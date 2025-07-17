const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: { type: String },
  avatarUrl: { type: String },
  phone: { type: String },
  email: { type: String },
  linkedinUrl: { type: String },
  currentTag: {
    type: String,
    enum: ["lead", "spam", "opportunity", "support"],
    default: "lead",
  },
  lastMessageAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactSchema);

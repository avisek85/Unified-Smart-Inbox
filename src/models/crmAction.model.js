const mongoose = require("mongoose");
const { Schema } = mongoose;

const crmActionSchema = new Schema({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: "Contact",
    required: true,
    index: true,
  },
  performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  actionType: {
    type: String,
    enum: ["blocked", "tagged_as_spam", "marked_interested"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CRMAction", crmActionSchema);

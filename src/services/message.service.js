/**
 * Service: normalize raw webhook payload
 * Find/create contact, save message, queue AI tagging
 */

const Contact = require("../models/contact.model");
const Message = require("../models/message.model");
const Channel = require("../models/channel.model");
const aiTaggingQueue = require("../queues/aiTagging.queue");
const socket = require("../sockets");

exports.processIncomingMessage = async (channelType, rawPayload) => {
  // Step 1: Normalize payload
  const normalized = await normalizePayload(channelType, rawPayload);

  // Step 2: Find or create contact
  let contact = await Contact.findOne({
    userId: normalized.userId,
    phone: normalized.contactPhone,
  });

  if (!contact) {
    contact = await Contact.create({
      userId: normalized.userId,
      name: normalized.contactName,
      phone: normalized.contactPhone,
      avatarUrl: normalized.avatarUrl,
      lastMessageAt: new Date(),
    });
  } else {
    contact.lastMessageAt = new Date();
    await contact.save();
  }

  // Step 3: Store message
  const message = await Message.create({
    userId: normalized.userId,
    contactId: contact._id,
    channelId: normalized.channelId,
    direction: "incoming",
    content: normalized.messageText,
    timestamp: new Date(),
  });

  // Step 4: Queue AI tagging
  aiTaggingQueue.addTaggingJob({
    contactId: contact._id,
    messageText: normalized.messageText,
  });

  // Step 5: Emit real-time to frontend
  socket.emitNewMessage(normalized.userId, contact._id, message);
};

/**
 * Normalize different payloads to standard shape.
 */
async function normalizePayload(channelType, raw) {
  if (channelType === "whatsapp") {
    // Example: find channel by phoneNumberId
    const phoneNumberId = raw.entry?.[0]?.id;
    const channel = await Channel.findOne({
      type: "whatsapp",
      "config.phoneNumberId": phoneNumberId,
    });
    if (!channel) throw new Error("Channel not found");

    const change = raw.entry[0].changes?.[0];
    const messageObj = change?.value?.messages?.[0];
    const contactObj = change?.value?.contacts?.[0];

    return {
      userId: channel.userId,
      channelId: channel._id,
      contactName: contactObj?.profile?.name || "Unknown",
      contactPhone: contactObj?.wa_id,
      avatarUrl: null,
      messageText: messageObj?.text?.body || "",
    };
  } else if (channelType === "gmail") {
    // Example: find channel, parse sender email, subject, etc.
    // Similar shape: userId, channelId, contactName, contactPhone/email, messageText
  } else if (channelType === "linkedin") {
    // parse LinkedIn payload
  } else {
    throw new Error("Unsupported channel");
  }
}

/**
 * Service: processIncomingMessage
 * Orchestrates: normalize raw webhook payload → find/create contact → save message → queue AI → emit socket
 */

const Contact = require("../models/contact.model");
const Message = require("../models/message.model");
const Channel = require("../models/channel.model");
const aiTaggingQueue = require("../queues/aiTagging.queue");
const socket = require("../sockets");

/**
 * Process incoming message from any channel
 * @param {String} channelType - e.g., 'whatsapp', 'gmail', 'linkedin'
 * @param {Object} rawPayload - raw webhook payload
 */
exports.processIncomingMessage = async (channelType, rawPayload) => {
  try {
    // Step 1: normalize payload to standard shape
    const normalized = await normalizePayload(channelType, rawPayload);

    // Step 2: find or create contact
    let contact = await Contact.findOne({
      userId: normalized.userId,
      externalId: normalized.contactExternalId,
    });

    if (!contact) {
      contact = await Contact.create({
        userId: normalized.userId,
        channelId: normalized.channelId,
        externalId: normalized.contactExternalId,
        name: normalized.contactName,
        avatar: normalized.avatarUrl,
        lastMessageAt: new Date(),
      });
    } else {
      contact.lastMessageAt = new Date();
      await contact.save();
    }

    // Step 3: store message
    const message = await Message.create({
      userId: normalized.userId,
      channelId: normalized.channelId,
      contactId: contact._id,
      direction: "inbound",
      text: normalized.messageText,
      attachments: normalized.attachments || [],
    });

    // Step 4: queue AI tagging
    aiTaggingQueue.addTaggingJob({
      contactId: contact._id,
      messageText: normalized.messageText,
    });

    // Step 5: emit real-time to frontend
    socket.emitNewMessage(normalized.userId, contact._id, message);

    console.log("[Message Processor] Successfully processed incoming message.");

    return message;
  } catch (err) {
    console.error("[Message Processor] Failed:", err.message);
    throw err;
  }
};

/**
 * Normalize payloads from different providers into standard shape
 * @param {String} channelType
 * @param {Object} raw
 * @returns {Object} normalized { userId, channelId, contactName, contactExternalId, avatarUrl, messageText, attachments }
 */
async function normalizePayload(channelType, raw) {
  if (channelType === "whatsapp") {
    const change = raw.entry?.[0]?.changes?.[0];
    const phoneNumberId = change?.value?.metadata?.phone_number_id;

    // Find the correct channel
    const channel = await Channel.findOne({
      type: "whatsapp",
      "config.phoneNumberId": phoneNumberId,
    });
    if (!channel) throw new Error("Channel not found for WhatsApp number");

    const messageObj = change?.value?.messages?.[0];
    const contactObj = change?.value?.contacts?.[0];

    return {
      userId: channel.userId,
      channelId: channel._id,
      contactName: contactObj?.profile?.name || "Unknown",
      contactExternalId: contactObj?.wa_id, // WhatsApp contact ID
      avatarUrl: null,
      messageText: messageObj?.text?.body || "",
      attachments: [], // extend later if needed
    };
  } else if (channelType === "gmail") {
    // TODO: parse Gmail payload
  } else if (channelType === "linkedin") {
    // TODO: parse LinkedIn payload
  } else {
    throw new Error("Unsupported channel type: " + channelType);
  }
}

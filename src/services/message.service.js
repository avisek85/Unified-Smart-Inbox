/**
 * Service: Message
 * Handles creating, listing, updating messages
 */

const Message = require("../models/message.model");

/**
 * Create & store a new message
 * @param {ObjectId} userId
 * @param {ObjectId} contactId
 * @param {ObjectId} channelId
 * @param {String} direction - incoming | outgoing
 * @param {String} content
 * @param {Array} [attachments]
 * @param {Date} [timestamp]
 * @returns saved message
 */
exports.createMessage = async (
  userId,
  contactId,
  channelId,
  direction,
  content,
  attachments = [],
  timestamp = new Date()
) => {
  return await Message.create({
    userId,
    contactId,
    channelId,
    direction,
    content,
    attachments,
    timestamp,
  });
};

/**
 * List messages for a specific contact (conversation thread)
 * @param {ObjectId} userId
 * @param {ObjectId} contactId
 * @param {Number} [limit=50]
 * @returns array of messages sorted by timestamp
 */
exports.getMessagesByContact = async (userId, contactId, limit = 50) => {
  return await Message.find({ userId, contactId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

/**
 * Update message status (e.g., delivered, read)
 * @param {ObjectId} userId
 * @param {String} messageId
 * @param {String} status
 * @returns updated message
 */
exports.updateMessageStatus = async (userId, messageId, status) => {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, userId },
    { $set: { status } },
    { new: true }
  );
  if (!message) throw new Error("Message not found or not authorized");
  return message;
};

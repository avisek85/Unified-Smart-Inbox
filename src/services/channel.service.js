/**
 * Service: Channel
 * Handles business logic for user channels: create, list, update, delete
 */

const Channel = require("../models/channel.model");

/**
 * Create new channel for user
 * @param {ObjectId} userId - logged-in user's ID
 * @param {Object} data - { type, name, config }
 * @returns saved Channel
 */
exports.createChannel = async (userId, data) => {
  const channel = new Channel({
    userId,
    type: data.type,
    name: data.name,
    config: data.config || {},
  });
  return await channel.save();
};

/**
 * Get all channels belonging to a user
 * @param {ObjectId} userId
 * @returns array of channels
 */
exports.getUserChannels = async (userId) => {
  return await Channel.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Update channel config / name
 * @param {ObjectId} userId - must own the channel
 * @param {String} channelId
 * @param {Object} updates - { name, config, status }
 * @returns updated Channel
 */
exports.updateChannel = async (userId, channelId, updates) => {
  const channel = await Channel.findOneAndUpdate(
    { _id: channelId, userId },
    { $set: updates },
    { new: true }
  );
  if (!channel) throw new Error("Channel not found or not authorized");
  return channel;
};

/**
 * Delete a channel
 * @param {ObjectId} userId
 * @param {String} channelId
 */
exports.deleteChannel = async (userId, channelId) => {
  const result = await Channel.findOneAndDelete({ _id: channelId, userId });
  if (!result) throw new Error("Channel not found or not authorized");
  return true;
};

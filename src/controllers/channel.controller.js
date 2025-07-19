/**
 * Controller: Channel
 * Handles HTTP layer: validate, call service, send response
 */

const channelService = require("../services/channel.service");

/**
 * POST /api/channels
 * Create a new channel
 */
exports.createChannel = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { type, name, config } = req.body;

    if (!type || !name) {
      return res.status(400).json({ error: "type and name are required" });
    }

    const channel = await channelService.createChannel(userId, {
      type,
      name,
      config,
    });

    return res.status(201).json(channel);
  } catch (err) {
    console.error("[Channel Controller] createChannel error:", err);
    return res.status(500).json({ error: "Failed to create channel" });
  }
};

/**
 * GET /api/channels
 * List user's channels
 */
exports.getMyChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    const channels = await channelService.getUserChannels(userId);
    return res.json(channels);
  } catch (err) {
    console.error("[Channel Controller] getMyChannels error:", err);
    return res.status(500).json({ error: "Failed to get channels" });
  }
};

/**
 * PUT /api/channels/:id
 * Update channel
 */
exports.updateChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.id;
    const updates = req.body;

    const updated = await channelService.updateChannel(
      userId,
      channelId,
      updates
    );
    return res.json(updated);
  } catch (err) {
    console.error("[Channel Controller] updateChannel error:", err);
    return res.status(404).json({ error: err.message || "Channel not found" });
  }
};

/**
 * DELETE /api/channels/:id
 * Delete channel
 */
exports.deleteChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.id;

    await channelService.deleteChannel(userId, channelId);
    return res.json({ success: true });
  } catch (err) {
    console.error("[Channel Controller] deleteChannel error:", err);
    return res.status(404).json({ error: err.message || "Channel not found" });
  }
};

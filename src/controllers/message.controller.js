/**
 * Controller: receives raw payload from webhooks
 * Calls service to process and save messages.
 */
const messageService = require("../services/message.service");

/**
 * Agent sends a new outbound message
 * POST /api/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const { contactId, channelId, text, attachments } = req.body;

    if (!contactId || !channelId || (!text && (!attachments || attachments.length === 0))) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = await messageService.createMessage({
      userId: req.user.id,
      contactId,
      channelId,
      direction: "outbound",
      text,
      attachments
    });

    return res.json(message);
  } catch (err) {
    console.error("[Message Controller] Failed to send message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Fetch thread of all messages for a contact
 * GET /api/messages/:contactId
 */
exports.getMessagesByContact = async (req, res) => {
  try {
    const contactId = req.params.contactId;

    if (!contactId) {
      return res.status(400).json({ error: "Missing contactId" });
    }

    const messages = await messageService.getMessagesByContact(contactId);
    return res.json(messages);
  } catch (err) {
    console.error("[Message Controller] Failed to fetch messages:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


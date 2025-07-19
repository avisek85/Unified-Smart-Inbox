/**
 * Routes: handles API endpoints for sending & fetching messages (agent/normal UI)
 */

const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const {protect} = require("../middlewares/auth.middleware"); // Make sure this middleware exists

// Protect all routes below
router.use(protect);

/**
 * @route POST /api/messages
 * @desc Agent sends outbound message
 * @body { contactId, channelId, text, attachments }
 */
router.post("/", messageController.sendMessage);

/**
 * @route GET /api/messages/:contactId
 * @desc Get all messages (thread) for a contact
 */
router.get("/:contactId", messageController.getMessagesByContact);

module.exports = router;

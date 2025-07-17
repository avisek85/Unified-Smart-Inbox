/**
 * Webhook routes for incoming messages
 * from Meta WhatsApp, Gmail, LinkedIn etc.
 * ✅ Purpose: just HTTP endpoints; logic kept outside.
 */

const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

// Meta WhatsApp webhook
router.post("/webhook/meta", messageController.handleMetaWebhook);

// Gmail webhook
router.post("/webhook/gmail", messageController.handleGmailWebhook);

// LinkedIn webhook
router.post("/webhook/linkedin", messageController.handleLinkedInWebhook);

module.exports = router;

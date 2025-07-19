/**
 * Webhook routes for incoming messages
 * from Meta WhatsApp, Gmail, LinkedIn etc.
 * ✅ Purpose: just HTTP endpoints; logic kept outside.
 */

const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook.controller");
const { protect } = require("../middlewares/auth.middleware");

// ✅ 1. Verify webhook during setup
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Meta WhatsApp webhook
router.post("/webhook", webhookController.handleMetaWebhook);

// Gmail webhook
router.post("/webhook/gmail", webhookController.handleGmailWebhook);

// LinkedIn webhook
router.post(
  "/webhook/linkedin",
  protect,
  webhookController.handleLinkedInWebhook
);

module.exports = router;

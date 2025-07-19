/**
 * Controller: handles incoming webhooks from providers
 * Calls processor to normalize, save, tag, and emit real-time
 */

const messageProcessor = require("../services/message.processor");




exports.handleMetaWebhook = async (req, res) => {
  const body = req.body;

  console.log("📦 Incoming webhook:", JSON.stringify(body, null, 2));
  try {
    // WhatsApp events
    if (body.object === "whatsapp_business_account") {
      // console.log("📦 Incoming webhook:", JSON.stringify(body, null, 2));
      if (!body || !Array.isArray(body.entry) || !body.entry[0]?.changes?.[0]) {
        console.error("❌ Invalid webhook body format");
        return res.sendStatus(400);
      }

      // Prevent replying to our own sent messages
      const change = body.entry[0].changes[0];
      const message = change.value?.messages?.[0];
      const businessNumber = change.value?.metadata?.phone_number_id;
      if (message?.from === businessNumber) {
        console.log("ℹ️ Skipping message sent by our own business number");
        return res.sendStatus(200);
      }

      await messageProcessor.processIncomingMessage("whatsapp", body);
      return res.sendStatus(200);
      // await whatsappHandler(body);
    }

    // Messenger events
    else if (body.object === "page") {
      const entry = body.entry?.[0];
      const messaging = entry?.messaging?.[0];
      if (messaging?.message) {
        if (messaging?.recipient?.id == process.env.FB_PAGE_ID) {
          await messengerHandler(messaging);
        } else {
          await instagramHandler(messaging); // Instagram messages come here too
        }
      }
    }

    return res.sendStatus(200); // acknowledge receipt
  } catch (err) {
    console.error("❌ Error in unified handler:", err);
    return res.sendStatus(500);
  }
};

/**
 * Handle Gmail webhook (placeholder)
 * POST /api/webhooks/gmail
 */
exports.handleGmailWebhook = async (req, res) => {
  try {
    const rawPayload = req.body;

    await messageProcessor.processIncomingMessage("gmail", rawPayload);

    return res.sendStatus(200);
  } catch (err) {
    console.error("[Webhook Controller] Gmail processing failed:", err);
    return res.status(500).json({ error: "Failed to process Gmail message" });
  }
};

/**
 * Handle LinkedIn webhook (placeholder)
 * POST /api/webhooks/linkedin
 */
exports.handleLinkedInWebhook = async (req, res) => {
  try {
    const rawPayload = req.body;

    await messageProcessor.processIncomingMessage("linkedin", rawPayload);

    return res.sendStatus(200);
  } catch (err) {
    console.error("[Webhook Controller] LinkedIn processing failed:", err);
    return res.status(500).json({ error: "Failed to process LinkedIn message" });
  }
};

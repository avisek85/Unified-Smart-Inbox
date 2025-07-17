/**
 * Controller: receives raw payload from webhooks
 * Calls service to process and save messages.
 */

const messageService = require("../services/message.service");

exports.handleMetaWebhook = async (req, res) => {
  const body = req.body;

  console.log("📦 Incoming webhook:", JSON.stringify(body, null, 2));
  try {
    // WhatsApp events
    if (body.object === "whatsapp_business_account") {
      // console.log("📦 Incoming webhook:", JSON.stringify(body, null, 2));
      if (!body || !Array.isArray(body.entry) || !body.entry[0]?.changes?.[0]) {
        console.error("❌ Invalid webhook body format");
        return;
      }
      // Prevent replying to our own sent messages
      if (message?.from === businessNumber) {
        console.log("ℹ️ Skipping message sent by our own business number");
        return;
      }
      await messageService.processIncomingMessage("whatsapp", req.body);
      res.sendStatus(200);
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

    res.sendStatus(200); // acknowledge receipt
  } catch (err) {
    console.error("❌ Error in unified handler:", err);
    res.sendStatus(500);
  }
};

exports.handleGmailWebhook = async (req, res) => {
  try {
    await messageService.processIncomingMessage("gmail", req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Gmail webhook error:", err);
    res.sendStatus(500);
  }
};

exports.handleLinkedInWebhook = async (req, res) => {
  try {
    await messageService.processIncomingMessage("linkedin", req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("LinkedIn webhook error:", err);
    res.sendStatus(500);
  }
};

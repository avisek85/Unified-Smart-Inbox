require("dotenv").config();
const ModelClient = require("@azure-rest/ai-inference").default;
const { AzureKeyCredential } = require("@azure/core-auth");
const { isUnexpected } = require("@azure-rest/ai-inference");

// Setup once
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";
const client = ModelClient(
  endpoint,
  new AzureKeyCredential(process.env.GITHUB_TOKEN)
);

/**
 * Calls Azure AI to classify a message as lead/support/spam/opportunity
 * @param {string} messageText
 * @returns {Promise<string>} tag (lowercased)
 */
async function getAiTag(messageText) {
  try {
    const response = await client.path("/chat/completions").post({
      body: {
        model,
        temperature: 0,
        top_p: 1,
        messages: [
          {
            role: "system",
            content: `You are an AI classifier. Classify the following customer message into one of: "lead", "support", "spam", "opportunity". Answer with only the label.`,
          },
          {
            role: "user",
            content: `Message: "${messageText}"`,
          },
        ],
      },
    });

    if (isUnexpected(response)) {
      console.error("[AI Tagging] Unexpected response:", response.body.error);
      return "unknown";
    }

    const tag = response.body.choices[0].message.content.trim().toLowerCase();
    return tag;
  } catch (err) {
    console.error("❌ [AI Tagging] Azure AI Error:", err.message || err);
    return "unknown";
  }
}

module.exports = getAiTag;

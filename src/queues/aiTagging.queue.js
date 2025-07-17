/**
 * AI Tagging Queue: uses BullMQ to offload GPT tagging job
 * Producer: addTaggingJob
 * Worker: process job, call Azure AI util, update contact
 */

const { Queue, Worker } = require("bullmq");
const Contact = require("../models/contact.model");
const getAiTag = require("../utils/getAitag");

// Redis connection settings
const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
};

// Create queue
const aiTaggingQueue = new Queue("aiTagging", { connection });

// --- Producer ---
/**
 * Add new message text to AI tagging queue
 * @param {Object} data - { contactId, messageText }
 */
exports.addTaggingJob = async (data) => {
  await aiTaggingQueue.add("tagMessage", data);
};

// --- Worker ---
const worker = new Worker(
  "aiTagging",
  async (job) => {
    const { contactId, messageText } = job.data;

    console.log("[AI Tagging Worker] Processing contactId:", contactId);

    // Step 1: Call util to get AI tag
    const tag = await getAiTag(messageText);

    console.log(
      `[AI Tagging Worker] Got tag "${tag}" for contact ${contactId}`
    );

    // Step 2: Update contact in DB
    await Contact.findByIdAndUpdate(contactId, { currentTag: tag });

    console.log(
      `[AI Tagging Worker] Updated contact ${contactId} with tag: ${tag}`
    );
  },
  { connection }
);

// Handle worker events
worker.on("failed", (job, err) => {
  console.error("[AI Tagging Worker] Job failed:", job.id, err);
});

worker.on("completed", (job) => {
  console.log("[AI Tagging Worker] Job completed:", job.id);
});

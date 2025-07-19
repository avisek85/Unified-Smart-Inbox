/**
 * Controller: Contact
 * Handles HTTP requests: create/update contact, list contacts, block, etc.
 */

const contactService = require("../services/contact.service");

/**
 * GET /api/contacts
 * Optionally filter by channelId: /api/contacts?channelId=...
 */
exports.getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.query;

    const contacts = await contactService.getContactsByUser(userId, channelId);
    return res.json(contacts);
  } catch (err) {
    console.error("[Contact Controller] getContacts error:", err);
    return res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

/**
 * PUT /api/contacts/:id
 * Update tag, notes, etc.
 */
exports.updateContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.id;
    const updates = req.body;

    const updated = await contactService.updateContact(
      userId,
      contactId,
      updates
    );
    return res.json(updated);
  } catch (err) {
    console.error("[Contact Controller] updateContact error:", err);
    return res.status(404).json({ error: err.message || "Contact not found" });
  }
};

/**
 * PATCH /api/contacts/:id/block
 * Block or unblock a contact
 */
exports.setBlocked = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.id;
    const { block } = req.body; // true or false

    if (typeof block !== "boolean") {
      return res.status(400).json({ error: "block must be boolean" });
    }

    const updated = await contactService.setContactBlocked(
      userId,
      contactId,
      block
    );
    return res.json(updated);
  } catch (err) {
    console.error("[Contact Controller] setBlocked error:", err);
    return res.status(404).json({ error: err.message || "Contact not found" });
  }
};

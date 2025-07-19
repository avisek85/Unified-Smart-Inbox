/**
 * Router: /api/contacts
 * Handles listing, updating, blocking contacts (and optionally: manual create)
 */

const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const { protect } = require("../middlewares/auth.middleware");

/**
 * @route GET /api/contacts
 * @desc List contacts (optionally filter by channelId)
 * @access Private
 */
router.get("/", protect, contactController.getContacts);

/**
 * @route PUT /api/contacts/:id
 * @desc Update contact info (tag, notes, etc.)
 * @access Private
 */
router.put("/:id", protect, contactController.updateContact);

/**
 * @route PATCH /api/contacts/:id/block
 * @desc Block or unblock a contact
 * @access Private
 */
router.patch("/:id/block", protect, contactController.setBlocked);

/* 
// OPTIONAL: manual creation, if you want agents to add contact manually
router.post('/', protect, contactController.createContact);
*/

module.exports = router;

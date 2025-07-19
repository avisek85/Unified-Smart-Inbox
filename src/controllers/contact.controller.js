const contactService = require("../services/contact.service");

/**
 * @route   POST /api/contacts
 * @desc    Create or get a contact
 * @access  Protected (requires JWT)
 */
exports.createOrGetContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId, externalId, name, avatar } = req.body;

    if (!channelId || !externalId) {
      return res.status(400).json({
        success: false,
        message: "channelId and externalId are required",
      });
    }

    const contact = await contactService.createOrGetContact({
      userId,
      channelId,
      externalId,
      name,
      avatar,
    });

    res.status(201).json({
      success: true,
      message: "Contact created or retrieved successfully",
      data: contact,
    });
  } catch (err) {
    console.error("[Contact Controller][CreateOrGet]", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create or get contact",
    });
  }
};

/**
 * @route   GET /api/contacts
 * @desc    List all contacts for logged-in user
 * @access  Protected (requires JWT)
 */
exports.getContactsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const contacts = await contactService.getContactsByUser(userId);

    res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (err) {
    console.error("[Contact Controller][GetContacts]", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};

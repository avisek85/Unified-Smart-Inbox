/**
 * Router: /api/channels
 * Handles channel CRUD routes
 */

const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channel.controller");

// Protect all routes (need to be logged in)
const { protect } = require("../middlewares/auth.middleware");
/**
 * @route POST /api/channels
 * @desc Add new channel
 * @access Private
 */
router.post('/', protect, channelController.createChannel);

/**
 * @route GET /api/channels
 * @desc List user's channels
 * @access Private
 */
router.get('/', protect, channelController.getMyChannels);

/**
 * @route PUT /api/channels/:id
 * @desc Update a channel
 * @access Private
 */
router.put('/:id', protect, channelController.updateChannel);

/**
 * @route DELETE /api/channels/:id
 * @desc Delete a channel
 * @access Private
 */
router.delete('/:id', protect, channelController.deleteChannel);

module.exports = router;




const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// @route   POST /api/auth/register
// @desc    Register new user
router.post("/register", authController.register);

// @route   POST /api/auth/login
// @desc    Login user & return JWT
router.post("/login", authController.login);

module.exports = router;

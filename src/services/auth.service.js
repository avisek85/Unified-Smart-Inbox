const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Token expires in X days (customize as needed)
const TOKEN_EXPIRY = "7d";

/**
 * Register a new user
 * @param {Object} data - { email, password, name }
 * @returns {User} created user
 */
exports.register = async (data) => {
  // Check if user already exists
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("Email already registered");
  }

  // Create user (password is hashed in model pre-save hook)
  const user = new User({
    email: data.email,
    password: data.password,
    name: data.name,
  });

  await user.save();
  return user;
};

/**
 * Login user and return token
 * @param {Object} data - { email, password }
 * @returns {Object} { user, token }
 */
exports.login = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Create JWT token
  const token = generateToken(user);

  return { user, token };
};

/**
 * Generate JWT token
 * @param {User} user
 * @returns {String} JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

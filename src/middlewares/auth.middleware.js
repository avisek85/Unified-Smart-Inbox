const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes
 * Verifies JWT & adds req.user = { id, email }
 */
exports.protect = (req, res, next) => {
  let token;

  // Get token from Authorization header: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "No token provided, authorization denied",
      });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("[Auth Middleware]", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

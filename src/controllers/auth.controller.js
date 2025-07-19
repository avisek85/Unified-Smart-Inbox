const authService = require("../services/auth.service");

/**
 * POST /api/auth/register
 * @param {Request} req
 * @param {Response} res
 */
exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("[Auth Register]", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * POST /api/auth/login
 * @param {Request} req
 * @param {Response} res
 */
exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        token,
      },
    });
  } catch (err) {
    console.error("[Auth Login]", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};



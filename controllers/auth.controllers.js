const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/apiError");
const authService = require("../services/auth.service");
const LoginSession = require("../models/loginSession.model");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(401, "Email or password is incorrect");
  }

  const data = await authService.login(email, password, req);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data,
  });
});

const logout = asyncHandler(async (req, res) => {
  const sessionId = req.user.sessionId;

  await LoginSession.findByIdAndUpdate(
    { _id: sessionId, isActive: true },
    {
      isActive: false,
      logoutTime: new Date(),
      refreshToken: null, // IMPORTANT
    },
    { new: true }, // it returns UPDATED document
  );

  if (!session) {
    throw new ApiError(401, "Session already expired");
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const data = await authService.refreshToken(req);

  res.status(200).json({
    success: true,
    message: "New token is generated successfully",
    data,
  });
});

const logoutAll = asyncHandler(async (req, res) => {

  const data = await authService.logoutAll(req);

  res.status(200).json({
    success: true,
    message: "Logout from all devices",
    data
  });
});

module.exports = { login, logout, refreshToken, logoutAll };

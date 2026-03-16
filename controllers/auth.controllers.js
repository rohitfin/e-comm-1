const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/apiError");
const authService = require("../services/auth.service");
const LoginSession = require("../models/loginSession.model");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password){
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

  await LoginSession.findByIdAndUpdate(sessionId, {
    isActive: false,
    logoutTime: new Date()
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });

});

module.exports = { login, logout };

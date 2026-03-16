const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const LoginSession = require("../models/loginSession.model");
const ApiError = require("../utils/apiError");

exports.login = async (email, password, req) => {
  const user = await User.findOne({ email })
    .select("+password")
    .populate("roleId", "name");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }
  
  // Create session
  const session = await LoginSession.create({
    userId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"]
  });

  // generate token
  const token = jwt.sign(
    {
      _id: user._id,
      roleId: user.roleId.id,
      role: user.roleId.name,
      sessionId: session._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roleId: user.roleId.id,
      role: user.roleId.name,
    },
  };
};
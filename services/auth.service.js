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

  // check session is already create for this user
  const sessions = await LoginSession.find({
    userId: user._id,
    isActive: true,
  }).sort({ createdAt: 1 }); // oldest first

  if (sessions.length >= 2) {
    // remove oldest
    await LoginSession.updateMany(
      { userId: user._id, isActive: true },
      {
        $set: {
          isActive: false,
          refreshToken: null,
        },
      },
    );
  }
  const refreshExpiryMs = 7 * 24 * 60 * 60 * 1000; // or parse from env
  const accessExpiryMs = 15 * 60 * 1000;
  const refreshExpiryDate = new Date(Date.now() + refreshExpiryMs);
  const accessExpiryDate = new Date(Date.now() + accessExpiryMs);

  // Refresh token
  const refreshToken = jwt.sign(
    {
      _id: user._id,
      roleId: user.roleId.id,
      role: user.roleId.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: refreshExpiryDate },
  );

  // Create session
  const session = await LoginSession.create({
    userId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    refreshToken: refreshToken,
    refreshTokenExpiryAt: refreshExpiryDate,
    accessTokenExpiryAt: accessExpiryDate,
  });

  // generate access token
  const accessToken = jwt.sign(
    {
      _id: user._id,
      roleId: user.roleId.id,
      role: user.roleId.name,
      sessionId: session._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: accessExpiryDate },
  );

  return {
    accessToken,
    refreshToken: refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roleId: user.roleId.id,
      role: user.roleId.name,
    },
  };
};

exports.refreshToken = async (req, sessionId) => {
  const session = await LoginSession.findById({ sessionId: sessionid, isActive: true });

  if(!session){
    return {
      message: 'Session is expired'
    }
  }

  

};

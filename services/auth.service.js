const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const LoginSession = require("../models/loginSession.model");
const ApiError = require("../utils/apiError");
const crypto = require("crypto");

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

  if (sessions.length > 0) {
    // remove oldest
    // const oldestSession = sessions[0];
    // await LoginSession.findByIdAndUpdate(oldestSession._id, {
    //   isActive: false,
    //   refreshToken: null,
    // });

    // remove all
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
    { expiresIn: process.env.refreshTokenExpiry },
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
    { expiresIn: process.env.accessTokenExpiry },
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

exports.refreshToken = async (req) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Token missing");
    }

    const token = authHeader.split(" ")[1];

    const session = await LoginSession.findOne({
      refreshToken: token,
      isActive: true,
    });

    if (!session) {
      throw new ApiError(401, "Session is expired");
    }

    if (session.refreshTokenExpiryAt < new Date()) {
      session.isActive = false;
      await session.save();
      throw new ApiError(401, "Refresh token expired");
    }

    // user
    const user = await User.findById(session.userId).populate("roleId", "name");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const accessExpiryMs = 15 * 60 * 1000;
    const accessExpiryDate = new Date(Date.now() + accessExpiryMs);

    // Rotate refresh token
    const newRefreshToken = crypto.randomBytes(40).toString("hex"); // Rotates refresh token to a random hex (different format than earlier JWT-based refresh token)

    session.refreshToken = newRefreshToken;
    session.refreshTokenExpiryAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );
    session.accessTokenExpiryAt = accessExpiryDate;
    session.lastActivity = new Date();

    await session.save();

    // new access token
    const accessToken = jwt.sign(
      {
        _id: user._id,
        roleId: user.roleId._id,
        role: user.roleId.name,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.accessTokenExpiry },
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roleId: user.roleId._id,
        role: user.roleId.name,
      },
    };
  } catch (error) {
    // if (error.name === "TokenExpiredError") {
    //   throw new ApiError(401, "Token expired");
    // }

    // if (error.name === "JsonWebTokenError") {
    //   throw new ApiError(401, "Invalid token");
    // }

    // throw new ApiError(401, "Authentication failed");

    throw error;
  }
};

exports.logoutAll = async (req) => {
  const user = req.user;

  const result = await LoginSession.updateMany(
    { isActive: true, _id: { $ne: user.sessionId } },
    {
      $set: {
        isActive: false,
        refreshToken: null,
        logoutTime: new Date(),
      },
    },
    // Intentionally deactivate other active sessions to enforce single-active-session policy
  );

  if (result.modifiedCount === 0) {
    throw new ApiError(404, "No active sessions found");
  }

  return { count: result.modifiedCount };
};

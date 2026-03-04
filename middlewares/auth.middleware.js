const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const LoginSession = require("../models/loginSession.model");

exports.authProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const session = await LoginSession.findOne({
      _id: decoded.sessionId,
      isActive: true,
    });

    if (!session) {
      throw new ApiError(401, "Session expired");
    }

    req.user = decoded; // attach user info
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    }

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token");
    }

    throw new ApiError(401, "Authentication failed");
  }
};

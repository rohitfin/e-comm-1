const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const LoginSession = require("../models/loginSession.model");
const User = require("../models/user.model");

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
    }).select("_id userId isActive"); // limits which fields are returned from DB

    if (!session) {
      throw new ApiError(401, "Session expired");
    }

    const user = await User.findById({_id: session.userId});

    if(!user){
      throw new ApiError(401, "User not found!");
    }

    if(!user.isActive){
      throw new ApiError(401, "User is inactive")
    }

    req.session = session;
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

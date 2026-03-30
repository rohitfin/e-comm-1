const errorHandler = (err, req, res, next) => {
  // Default values
  let status = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV !== "production";

  // Safe default message
  let message = err.message || "Internal Server Error";

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongo Duplicate Key Error
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field} already exists`
      : "Duplicate field value";
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}`;
  }

  // JWT Errors (from jsonwebtoken)
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Authentication failed";
  }

  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired";
  }

  // Hide internal errors in production
  if (!isDevelopment && status === 500) {
    message = "Something went wrong";
  }

  // Logging (ALWAYS log)
  console.error("🔥 ERROR LOG");
  console.error({
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status,
    name: err.name,
    message: err.message, // original message
    stack: err.stack,
  });

  // Response to client
  res.status(status).json({
    success: false,
    message, // safe message
    error: isDevelopment ? err.name : "Error",
    ...(isDevelopment && { stack: err.stack }), // if (isDevelopment) { response.stack = err.stack; }
  });
};

module.exports = errorHandler;
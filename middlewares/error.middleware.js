const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === "development";

  // Normalize message
  let message =
    status === 500 && !isDevelopment
      ? "Internal Server Error"
      : err.message;

  // Handle known errors
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation Error";
  }

  if (err.code === 11000) {
    status = 400;
    message = "Duplicate field value";
  }

  // Log error with request info
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${status} - ${err.message}`
  );

  if (isDevelopment) {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    message,
    error: err.name || "Error",
    ...(isDevelopment && { stack: err.stack }), // if (isDevelopment) { response.stack = err.stack; }
  });
};

module.exports = errorHandler;
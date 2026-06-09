const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next); // Wrap async route handlers to forward thrown errors to Express' error middleware

module.exports = asyncHandler;

const ApiError = require("../utils/ApiError");

const validateMiddleware = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  req.body = value; // sanitized value

  next();
};

module.exports = validateMiddleware;

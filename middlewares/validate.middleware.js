const ApiError = require("../utils/ApiError");

const validateMiddleware = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  }); 
  // stripUnknown: true, // remove extra fields
  // allowUnknown: true, // Allow Unknown Fields (Not Recommended)
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  req.body = value; // sanitized value

  next();
};

module.exports = validateMiddleware;

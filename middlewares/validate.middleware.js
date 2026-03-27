const ApiError = require("../utils/apiError");

/*
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
*/

const validateMiddleware = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property]; // dynamic (body / params / query)

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true, 
    });

    if (error) {
      return next(new ApiError(400, error.details[0].message));
    }

    req[property] = value; // assign sanitized data

    next();
  };
};

module.exports = validateMiddleware;

const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

const validateId = (req, res, next) => {
  const { id } = req.params;

  console.log("validateId hit:", req.originalUrl);
  
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid id parameter'));
  }

  next();
};

module.exports = validateId;

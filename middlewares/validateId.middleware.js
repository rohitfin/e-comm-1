const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, 'Invalid id parameter'));
  }

  next();
};

module.exports = validateId;

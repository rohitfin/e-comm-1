const Joi = require("joi");

exports.createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  price: Joi.number().greater(0).required(),
  categoryId: Joi.string().length(24).hex().required(),
  description: Joi.string().allow("").optional(),
});

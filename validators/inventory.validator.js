const Joi = require("joi");

exports.createInventorySchema = Joi.object({
  warehouse: Joi.string().trim().min(2).max(50).required(),
  stock: Joi.number().min(0).required(),
  productId: Joi.string().length(24).hex().required(),
});

exports.updateInventorySchema = Joi.object({
  warehouse: Joi.string().trim().min(2).max(50).required(),
  stock: Joi.number().min(0).required(),
}) //.min(1); // at least one field required
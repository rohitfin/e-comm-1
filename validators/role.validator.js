const Joi = require("joi");

exports.createRoleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

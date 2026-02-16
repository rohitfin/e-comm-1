const Joi = require("joi");

exports.createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required(),

  password: Joi.string()
    .min(6)
    .optional(),

  roleId: Joi.string()
    .length(24)
    .hex()
    .required(),

});

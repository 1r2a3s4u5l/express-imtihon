const Joi = require("joi");

exports.currency_typeValidation = (data) => {
  const currency_typeSchema = new Joi.object({
    name: Joi.string().trim().min(2).max(255).required(),
    description: Joi.string().trim(),
  });

  return currency_typeSchema.validate(data, { abortEarly: false });
};

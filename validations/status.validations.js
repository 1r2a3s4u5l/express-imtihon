const Joi = require("joi");

exports.statusValidation = (data) => {
  const statusSchema = new Joi.object({
    name: Joi.string().trim().min(2).max(255).required(),
    description: Joi.string().trim(),
  });

  return statusSchema.validate(data, { abortEarly: false });
};

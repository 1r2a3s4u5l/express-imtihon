const Joi = require("joi");

exports.adminValidation = (data) => {
  const adminSchema = new Joi.object({
    full_name: Joi.string().trim().min(2).max(255),
    user_name: Joi.string().trim().max(255).alphanum(),
    password: Joi.string().min(6).max(25),
    phone_number: Joi.string().min(9).max(30),
    email: Joi.string().email(),
    tg_link: Joi.string().trim(),
    description: Joi.string().trim(),
    is_creator: Joi.boolean()
  });

  return adminSchema.validate(data, { abortEarly: false });
};

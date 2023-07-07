const Joi = require("joi");

exports.orderValidation = (data) => {
  const orderSchema = new Joi.object({
    order_unique_id:Joi.string().trim().required(),
    full_name: Joi.string().trim().min(2).max(255).required(),
    phone_number: Joi.string().min(9).max(30).required(),
    product_link: Joi.string().trim().required(),
    summa: Joi.number().required(),
    current_type_id: Joi.number().required(),
    truck:Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    description: Joi.string().trim(),
  });

  return orderSchema.validate(data, { abortEarly: false });
};

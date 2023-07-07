const Joi = require("joi");

exports.operationValidation = (data) => {
  const operationSchema = new Joi.object({
    order_id: Joi.number().required(),
    status_id: Joi.number().required(),
    operation_date: Joi.date().required(),
    admin_id: Joi.number().required(),
    description: Joi.string().trim(),
  });

  return operationSchema.validate(data, { abortEarly: false });
};

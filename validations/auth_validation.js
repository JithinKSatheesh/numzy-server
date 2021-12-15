const Joi = require("@hapi/joi");

const userRegistrationSchema = Joi.object({
  email: Joi.string().required(),
  name: Joi.string().required(),
  image: Joi.string().required(),
  fcmtoken: Joi.string().required(),
});

exports.validateRegistrationDetails = (body) => {
  return userRegistrationSchema.validate(body);
};

const Joi = require("@hapi/joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
});

exports.validateUpdateProfileDetails = (body) => {
  return updateProfileSchema.validate(body);
};

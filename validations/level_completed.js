const Joi = require("@hapi/joi");

const levelCompletedSchema = Joi.object({
  completedtime: Joi.number().required().min(0),
  earnedStars: Joi.number().required().min(0).max(3),
  levelID: Joi.number().required(),
});

exports.valiateLevelCompletedDetails = (body) => {
  return levelCompletedSchema.validate(body);
};

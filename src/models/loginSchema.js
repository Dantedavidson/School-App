const Joi = require("joi");

const validateLogin = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(36).required(),
    password: Joi.string().min(6).max(36).required(),
  });
  return schema.validate(user);
};

module.exports = validateLogin;

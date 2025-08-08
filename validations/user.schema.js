const joi = require("joi");

const addUserSchema = {
  body: joi.object({
    name: joi.string(),
  }),
};

module.exports = {
  addUserSchema,
};

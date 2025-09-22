import joi from "joi";

const addUserSchema = {
  body: joi.object({
    name: joi.string(),
  }),
};

const userSchemas = {
  addUserSchema,
};

export default userSchemas;
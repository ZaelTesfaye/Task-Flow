import joi from"joi";

const registerSchema = {
  body: joi.object({
    name : joi.string().min(3).max(30).required(),  
    email: joi.string().email().required(),
    password: joi.string().min(6).max(18).required(),
  })
  .unknown(true),
};

const loginSchema = {
  body: joi.object({
    email : joi.string().email().required(),
    password: joi.string().min(6).required()
  })
  .unknown(true),
};

const authSchemas = {
  registerSchema,
  loginSchema
};

export default authSchemas;
import joi from"joi";
import type { LoginBody, RegisterBody } from "../dtos/auth.dto.js";

const registerSchema = {
  body: joi.object<RegisterBody>({
    name : joi.string().min(3).max(30).required(),  
    email: joi.string().email().required(),
    password: joi.string().min(6).max(18).required(),
  })
  .required().unknown(true),
};

const loginSchema = {
  body: joi.object<LoginBody>({
    email : joi.string().email().required(),
    password: joi.string().min(4).required()
  })
 .required().unknown(true),
};

const authSchemas = {
  registerSchema,
  loginSchema
};

export default authSchemas;
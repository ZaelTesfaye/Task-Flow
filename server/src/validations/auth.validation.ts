import joi from "joi";
import type { LoginBody, RegisterBody } from "../dtos/index.js";

export const registerSchema = {
  body: joi
    .object<RegisterBody>({
      name: joi.string().min(3).max(30).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).max(18).required(),
    })
    .required()
    .unknown(true),
};

export const loginSchema = {
  body: joi
    .object<LoginBody>({
      email: joi.string().email().required(),
      password: joi.string().min(4).required(),
    })
    .required()
    .unknown(true),
};

export const requestPasswordResetSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
    })
    .required()
    .unknown(true),
};

export const verifyResetCodeSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
      code: joi.string().length(6).required(),
    })
    .required()
    .unknown(true),
};

export const resetPasswordSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
      newPassword: joi.string().min(6).max(18).required(),
    })
    .required()
    .unknown(true),
};

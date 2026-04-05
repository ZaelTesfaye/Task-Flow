import { z } from "../lib/zod-openapi.js";
import { UserSchema } from "./user.schema.js";
import { ApiSuccessResponseSchema } from "./api.schema.js";

// Request Validation Schemas
export const RegisterRequestSchema = {
  body: z
    .object({
      name: z.string().min(3).max(30),
      email: z.string().email(),
      password: z.string().min(6).max(18),
    })
    .openapi("RegisterBody"),
};

export const LoginRequestSchema = {
  body: z
    .object({
      email: z.string().email(),
      password: z.string().min(4),
    })
    .openapi("LoginBody"),
};

export const RequestPasswordResetRequestSchema = {
  body: z
    .object({
      email: z.string().email(),
    })
    .openapi("RequestPasswordResetBody"),
};

export const VerifyResetCodeRequestSchema = {
  body: z
    .object({
      email: z.string().email(),
      code: z.string().length(6),
    })
    .openapi("VerifyResetCodeBody"),
};

export const ResetPasswordRequestSchema = {
  body: z
    .object({
      email: z.string().email(),
      newPassword: z.string().min(6).max(18),
    })
    .openapi("ResetPasswordBody"),
};

// Response Schemas

export const AuthResponseSchema = ApiSuccessResponseSchema(
  z.object({
    user: UserSchema,
    token: z.string(),
  }),
).openapi("AuthResponse");

export const PasswordResetResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("PasswordResetResponse");

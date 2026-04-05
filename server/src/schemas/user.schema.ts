import { z } from "../lib/zod-openapi.js";
import { ApiSuccessResponseSchema } from "./api.schema.js";

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    avatar: z.string().nullable().optional(),
    role: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("User");

// Request Validation Schemas
export const UpdateUserRequestSchema = {
  body: z
    .object({
      name: z.string().min(1).max(100).optional(),
    })
    .openapi("UpdateUserBody"),
};

// Response Schemas
export const UpdateUserResponseSchema = ApiSuccessResponseSchema(UserSchema).openapi("UpdateUserResponse");

export const GetMeResponseSchema = UserSchema.nullable().optional().openapi("GetMeResponse");

export const DeleteUserResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("DeleteUserResponse");

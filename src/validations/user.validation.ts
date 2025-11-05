import joi from "joi";
import type { UpdateUserDTO } from "../dtos/user.dto.js";

export const updateUserSchema = {
  body: joi
    .object<UpdateUserDTO>({
      name: joi.string().min(1).max(100).optional(),
      email: joi.string().email().optional(),
    })
    .or("name", "email")
    .unknown(true),
};

import joi from "joi";
import type { UpdateUserDTO } from "../dtos/index.js";

export const updateUserSchema = {
  body: joi
    .object<UpdateUserDTO>({
      name: joi.string().min(1).max(100).optional(),
    })
    .unknown(true),
};

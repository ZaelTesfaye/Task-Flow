import joi from "joi";
import type { AddUserBody } from "../dtos/user.dto.js";

const addUserSchema = {
  body: joi.object<AddUserBody>({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(36).required()
  }),
};

const userSchemas = {
  addUserSchema,
};

export default userSchemas;
import joi from "joi";
import type { AddUserBody } from "../dtos/user.dto.js";

const addUserSchema = {
  body: joi.object<AddUserBody>({
    name: joi.string(),
  }),
};

const userSchemas = {
  addUserSchema,
};

export default userSchemas;
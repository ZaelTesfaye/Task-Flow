import Joi from "joi";
import type {
  AddAdmin,
  GetAllUsers,
  RemoveUser,
  UpdateUserPassword,
} from "../dtos/index.js";

export const getAllUsersSchema = {
  params: Joi.object<GetAllUsers>({
    page: Joi.number().min(1).required(),
    limit: Joi.number().min(1).max(100).required(),
  })
    .required()
    .unknown(true),
};

export const removeUserSchema = {
  body: Joi.object<RemoveUser>({
    userId: Joi.string().uuid().required(),
  })
    .required()
    .unknown(true),
};

export const updateUserPasswordSchema = {
  body: Joi.object<UpdateUserPassword>({
    userId: Joi.string().uuid().required(),
    password: Joi.string().min(4).required(),
  })
    .required()
    .unknown(true),
};

export const addAdminSchema = {
  body: Joi.object<AddAdmin>({
    username: Joi.string().alphanum().min(3).max(30).required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(4).required(),
  })
    .required()
    .unknown(true),
};

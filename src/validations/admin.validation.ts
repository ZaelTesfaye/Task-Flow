import Joi from "joi"
import type { GetAllUsers, RemoveUser, UpdateUserPassword } from "../dtos/admin.dto.js"

export const getAllUsersSchema = {
    body: Joi.object<GetAllUsers>({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).max(100).required(),
    })
    .required().unknown(true),
}

export const removeUserSchema = {
    body: Joi.object<RemoveUser>({
        userId: Joi.string().uuid().required(),
    })
    .required().unknown(true),
}

export const updateUserPasswordSchema = {
    body: Joi.object<UpdateUserPassword>({
        userId: Joi.string().uuid().required(),
        password: Joi.string().min(4).required(),
    })
    .required().unknown(true),
}
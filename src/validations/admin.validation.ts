import Joi from "joi"
import type { GetAllUsers, RemoveUser } from "../dtos/admin.dto.js"

export const getAllUsersSchema = {
    body: Joi.object<GetAllUsers>({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).max(100).required(),
    })
}

export const removeUserSchema = {
    body: Joi.object<RemoveUser>({
        userId: Joi.string().uuid().required(),
    }),
}
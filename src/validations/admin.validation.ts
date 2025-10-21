import Joi from "joi"
import type { GetAllUsers } from "../dtos/admin.dto.js"

export const getAllUsersSceham = {
    body: Joi.object<GetAllUsers>({
        page: Joi.number().min(1).required(),
        limit: Joi.number().min(1).max(100).required(),
    })
}
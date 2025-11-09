import joi from "joi";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/index.js";

export const createCategorySchema = {
  body: joi
    .object<CreateCategoryDTO>({
      name: joi.string().min(1).max(100).required(),
    })
    .required()
    .unknown(true),
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const updateCategorySchema = {
  body: joi
    .object<UpdateCategoryDTO>({
      name: joi.string().min(1).max(100).optional(),
    })
    .required()
    .unknown(true),
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      categoryId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const removeCategorySchema = {
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      categoryId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

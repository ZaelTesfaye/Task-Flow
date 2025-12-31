import joi from "joi";
import type { CreatePhaseDTO, UpdatePhaseDTO } from "../dtos/index.js";

export const createPhaseSchema = {
  body: joi
    .object<CreatePhaseDTO>({
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

export const updatePhaseSchema = {
  body: joi
    .object<UpdatePhaseDTO>({
      name: joi.string().min(1).max(100).optional(),
    })
    .required()
    .unknown(true),
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      phaseId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const removePhaseSchema = {
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      phaseId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

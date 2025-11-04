import joi from "joi";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  AddMemberDTO,
} from "../dtos/project.dto.js";

export const createProjectSchema = {
  body: joi
    .object<CreateProjectDTO>({
      title: joi.string().min(1).max(100).required(),
      description: joi.string().min(1).max(255).required(),
    })
    .required()
    .unknown(true),
};

export const updateProjectSchema = {
  body: joi
    .object<UpdateProjectDTO>({
      title: joi.string().min(1).max(100).optional(),
      description: joi.string().min(1).max(255).optional(),
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

export const removeProjectSchema = {
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const addMemberSchema = {
  body: joi
    .object<AddMemberDTO>({
      userId: joi.string().uuid().required(),
      access: joi.string().valid("admin", "member").optional(),
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

export const removeMemberSchema = {
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      userId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),
};

export const promoteMemberSchema = {
  params: joi
    .object({
      projectId: joi.string().uuid().required(),
      userId: joi.string().uuid().required(),
    })
    .required()
    .unknown(true),

  body: joi.object({
    access: joi.string().valid("admin", "member").required(),
  }),
};

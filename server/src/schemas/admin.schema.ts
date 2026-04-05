import { z } from "../lib/zod-openapi.js";
import { UserSchema } from "./user.schema.js";
import { ApiSuccessResponseSchema } from "./api.schema.js";

// Request Validation Schemas

export const GetAllUsersRequestSchema = {
  params: z.object({
    page: z.coerce.number().min(1),
    limit: z.coerce.number().min(1).max(100),
  }),
};

export const RemoveUserRequestSchema = {
  params: z.object({
    userId: z.string().uuid(),
  }),
};

export const UpdateUserPasswordRequestSchema = {
  body: z
    .object({
      userId: z.string().uuid(),
      password: z.string().min(4),
    })
    .openapi("UpdateUserPasswordBody"),
};

export const AddAdminRequestSchema = {
  body: z
    .object({
      username: z.string().min(3).max(30),
      name: z.string().min(3).max(50),
      password: z.string().min(4),
    })
    .openapi("AddAdminBody"),
};

export const AdminLoginRequestSchema = {
  body: z
    .object({
      email: z.string().min(3).max(30),
      password: z.string().min(4),
    })
    .openapi("AdminLoginBody"),
};

// Response Schemas
export const AdminLoginResponseSchema = z
  .object({
    message: z.string(),
    data: z.object({
      user: UserSchema,
      token: z.string(),
    }),
  })
  .openapi("AdminLoginResponse");

export const AdminStatsResponseSchema = z
  .object({
    totalUsers: z.number(),
    totalProjects: z.number(),
    totalTasks: z.number(),
    recentActivity: z.array(z.any()),
  })
  .openapi("AdminStatsResponse");

export const UsersListResponseSchema = ApiSuccessResponseSchema(z.array(UserSchema)).openapi("UsersListResponse");

export const UserPasswordUpdateResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("UserPasswordUpdateResponse");

export const AddAdminResponseSchema = z
  .object({
    message: z.string(),
    data: z.object({
      user: UserSchema,
      token: z.string(),
    }),
  })
  .openapi("AddAdminResponse");

export const RemoveUserResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("RemoveUserResponse");

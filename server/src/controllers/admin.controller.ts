import type { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import httpStatus from "http-status";

import type { AddAdmin, GetAllUsers as GetAllUsersParams, RemoveUser, UpdateUserPassword } from "../types/index.js";
import { adminServices, authServices } from "../services/index.js";
import { asyncWrapper } from "../lib/index.js";
import {
  UsersListResponseSchema,
  RemoveUserResponseSchema,
  UserPasswordUpdateResponseSchema,
  AddAdminResponseSchema,
} from "../schemas/index.js";

export const getAllUsers: RequestHandler = asyncWrapper(
  async (req: Request<GetAllUsersParams>, res: Response<z.infer<typeof UsersListResponseSchema>>) => {
    const { page, limit } = req.params;
    const result = await adminServices.getAllUsers(page, limit);
    if (result) {
      return res.status(httpStatus.OK).json({
        message: "Users retrieved successfully",
        data: result,
      });
    }
    res.status(httpStatus.NOT_FOUND).json({
      message: "User Not Found",
    } as any);
  },
);

export const removeUser: RequestHandler = asyncWrapper(
  async (req: Request<RemoveUser>, res: Response<z.infer<typeof RemoveUserResponseSchema>>) => {
    const { userId } = req.params;

    const { role } = req.user!;

    const result = await adminServices.removeUser(userId, role);

    if (result) {
      return res.json({
        message: "User deleted successfully",
      });
    }
    res.status(httpStatus.NOT_FOUND).json({
      message: "User Not Found",
    });
  },
);

export const updateUserPassword: RequestHandler = asyncWrapper(
  async (
    req: Request<{}, {}, UpdateUserPassword>,
    res: Response<z.infer<typeof UserPasswordUpdateResponseSchema>>,
  ) => {
    console.log("Update User Password called with body:", req.body);
    const { userId, password } = req.body;

    await adminServices.updateUserPassword(userId, password);

    res.json({
      message: "Password updated successfully",
    });
  },
);

export const createAdmin: RequestHandler = asyncWrapper(
  async (req: Request<{}, {}, AddAdmin>, res: Response<z.infer<typeof AddAdminResponseSchema>>) => {
    const { username, name, password } = req.body;
    const adminUser = await authServices.register(username, name, password, "admin");

    res.json({
      message: "Admin created successfully",
      data: adminUser,
    });
  },
);

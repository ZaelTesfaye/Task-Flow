import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import type {
  AddAdmin,
  GetAllUsers as GetAllUsersParams,
  RemoveUser,
  UpdateUserPassword,
} from "../dtos/index.js";
import { adminServices } from "../services/index.js";
import { asyncWrapper } from "../lib/index.js";

export const getAllUsers = asyncWrapper(
  async (req: Request<GetAllUsersParams>, res: Response) => {
    const { page, limit } = req.params;
    const result = await adminServices.getAllUsers(page, limit);
    if (result) {
      res.status(httpStatus.OK).json(result);
    }
  },
);
export const removeUser = asyncWrapper(
  async (req: Request<RemoveUser>, res: Response) => {
    const { userId } = req.params;

    const { role } = req.user!;

    const result = await adminServices.removeUser(userId, role);

    if (result) {
      res.json({
        message: "User deleted successfully",
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        message: "User Not Found",
      });
    }
  },
);

export const updateUserPassword = asyncWrapper(
  async (req: Request<{}, {}, UpdateUserPassword>, res, next) => {
    console.log("Update User Password called with body:", req.body);
    const { userId, password } = req.body;

    await adminServices.updateUserPassword(userId, password);

    res.json({
      message: "Password updated successfully",
    });
  },
);

export const addAdmin = asyncWrapper(
  async (req: Request<{}, {}, AddAdmin>, res: Response, next: NextFunction) => {
    const { username, name, password } = req.body;
    await adminServices.addAdmin(username, name, password);
    res.json({
      message: "Admin added successfully",
    });
  },
);

import type { NextFunction, Request, Response } from "express";
import type {
  AddAdmin,
  GetAllUsers,
  RemoveUser,
  UpdateUserPassword,
} from "../dtos/admin.dto.js";
import * as adminService from "../services/admin.service.js";
import httpStatus from "http-status";
import asyncWrapper from "../lib/asyncWrapper.js";

export const viewAllUsers = asyncWrapper(
  async (req: Request<{}, {}, GetAllUsers>, res: Response) => {
    const { page, limit } = req.body;
    const result = await adminService.getAllUsers(page, limit);
    if (result) {
      res.status(httpStatus.OK).json(result);
    }
  }
);
export const removeUser = asyncWrapper(
  async (req: Request<{}, {}, RemoveUser>, res: Response) => {
    const userId = req.body.userId;

    const result = await adminService.removeUser(userId);

    if (result) {
      res.status(httpStatus.OK).json({
        status: true,
        message: "User deleted successfully",
      });
    } else {
      res.status(httpStatus.NOT_FOUND).json({
        status: false,
        message: "User Not Found",
      });
    }
  }
);

export const updateUserPassword = asyncWrapper(
  async (req: Request<{}, {}, UpdateUserPassword>, res, next) => {
    console.log("Update User Password called with body:", req.body);
    const { userId, password } = req.body;

    await adminService.updateUserPassword(userId, password);

      res.status(httpStatus.OK).json({
        status: true,
        message: "Password updated successfully",
      });
  }
);

export const addAdmin = asyncWrapper(
  async (req: Request<{}, {}, AddAdmin>, res: Response, next: NextFunction) => {
    const { username, name, password } = req.body;
    await adminService.addAdmin(username, name, password);
    res.status(httpStatus.OK).json({
      status: true,
      message: "Admin added successfully",
    })
  }
);

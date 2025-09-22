import userServices from "../services/user.services.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import type { Request, Response, NextFunction } from "express";

const addUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    await userServices.addUser(name, email, password);

    res.status(201).json({
      status: true,
      message: "User Added successfully",
    });
  }
);

export default {
  addUser,
};

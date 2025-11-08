import type { CookieOptions, Request, Response } from "express";
import httpStatus from "http-status";

import { asyncWrapper } from "../lib/index.js";
import { authServices } from "../services/index.js";
import { type RegisterBody, type LoginBody } from "../dtos/index.js";
import config from "../config/config.js";

export const defaultCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: config.env === "production" ? true : false,
  sameSite: "lax",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

export const register = asyncWrapper(
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { name, email, password } = req.body;
    const userData = await authServices.register(name, email, password);

    res
      .cookie("auth", userData.token, defaultCookieConfig)
      .status(httpStatus.CREATED)
      .json({
        message: "User registered successfully",
        data: userData,
      });
  },
);

export const login = asyncWrapper(
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;
    // check if the user exists
    const data = await authServices.login(email, password);
    res.cookie("auth", data.token, defaultCookieConfig).json({
      message: "User logged in successfully",
      data: data,
    });
  },
);

export const logout = asyncWrapper(async (req: Request, res: Response) => {
  res
    .clearCookie("auth", {
      path: "/",
    })
    .send();
});

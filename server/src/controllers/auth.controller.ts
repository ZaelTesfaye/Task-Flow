import type { CookieOptions, Request, Response } from "express";
import httpStatus from "http-status";

import { asyncWrapper } from "../lib/index.js";
import { authServices } from "../services/index.js";
import { type RegisterBody, type LoginBody } from "../dtos/index.js";
import config from "../config/config.js";

export const defaultCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: config.env === "production" ? true : false,
  sameSite: "none",
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
    res
      .cookie(
        `${data.user.role === "user" ? "auth" : "adminAuth"}`,
        data.token,
        defaultCookieConfig,
      )
      .json({
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
    .clearCookie("adminAuth", {
      path: "/",
    })
    .send();
});

export const requestPasswordReset = asyncWrapper(
  async (req: Request<{}, {}, { email: string }>, res: Response) => {
    const { email } = req.body;
    const result = await authServices.requestPasswordReset(email);
    res.json({
      message: result.message,
    });
  },
);

export const verifyResetCode = asyncWrapper(
  async (
    req: Request<{}, {}, { email: string; code: string }>,
    res: Response,
  ) => {
    const { email, code } = req.body;
    const result = await authServices.verifyResetCode(email, code);
    res.json({
      message: result.message,
    });
  },
);

export const resetPassword = asyncWrapper(
  async (
    req: Request<{}, {}, { email: string; newPassword: string }>,
    res: Response,
  ) => {
    const { email, newPassword } = req.body;
    const data = await authServices.resetPassword(email, newPassword);
    res
      .cookie("auth", data.token, defaultCookieConfig)
      .json({
        message: data.message,
        data: {
          user: data.user,
          token: data.token,
        },
      });
  },
);


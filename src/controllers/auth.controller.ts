import asyncWrapper from "../lib/asyncWrapper.js";
import * as authService from "../services/auth.service.js";
import type { CookieOptions, Request, Response } from "express";
import config from "../config/config.js";
import { type RegisterBody, type LoginBody } from "../dtos/auth.dto.js";

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
    const userData = await authService.register(name, email, password);

    res.cookie("auth", userData.token, defaultCookieConfig).status(201).json({
      message: "User registered successfully",
      status: true,
      data: userData,
    });
  },
);

export const login = asyncWrapper(
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;
    // check if the user exists
    const data = await authService.login(email, password);
    res.cookie("auth", data.token, defaultCookieConfig).status(200).json({
      message: "User logged in successfully",
      status: true,
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

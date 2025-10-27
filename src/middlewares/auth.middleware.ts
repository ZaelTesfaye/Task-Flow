import { APIError } from "../utils/error.js";
import httpStatus from "http-status";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import type { JwtPayload } from "../types/jwt.js";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;

  if (!token) {
    throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  let userData;
  try {
    userData = jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  req.user = userData;

  // Role-based access control
  const isAdminPath = req.baseUrl === "/admin";
  const isSuperAdminPath = req.baseUrl === "/super-admin";
  const isAdmin = userData.role === "admin" || userData.role === "super-admin";
  const isSUperAdmin = userData.role == "super-admin";

  if (
    (!isAdmin && !isAdminPath) ||
    (isAdmin && isAdminPath) ||
    (isSUperAdmin && isSuperAdminPath)
  ) {
    return next(); // allowed
  } else {
    throw new APIError("Forbidden", httpStatus.FORBIDDEN);
  }
};

export default authMiddleware;

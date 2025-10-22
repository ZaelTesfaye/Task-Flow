import { APIError } from "../utils/error.js";
import httpStatus from "http-status";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import type { JwtPayload } from "../types/jwt.js";


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;

  if (!token) {
    console.log("No token found");
    throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  try {
    const userData = jwt.verify(token, config.jwtSecret) as JwtPayload;

    req.user = userData;
  
    // Role-based access control
    const isAdminPath = req.baseUrl === "/admin";

    console.log("path: ", req.path);
    console.log("Is admin path: ", isAdminPath);
  
    if (
      (!userData.isAdmin && !isAdminPath) ||
      (userData.isAdmin && isAdminPath)
    ) {
      return next(); // allowed
    } else {
      throw new APIError("Forbidden", httpStatus.FORBIDDEN);
    }
  } catch (error) {
    throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);
  }
};

export default authMiddleware;

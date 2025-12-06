import { APIError } from "../utils/index.js";
import httpStatus from "http-status";
import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isAdminPath = req.baseUrl.includes("/admin");
  const isSuperAdminPath = req.baseUrl.includes("/super-admin");

  try {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        headers[key] = Array.isArray(value) ? value.join(", ") : value;
      }
    }
    const session = await auth.api.getSession({
      headers,
    });

    if (!session?.user) {
      throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role!,
    };

    // Role-based access
    const isAdmin =
      session.user.role === "admin" || session.user.role === "super-admin";
    const isSuperAdmin = session.user.role === "super-admin";

    if (
      (!isAdmin && !isAdminPath && !isSuperAdminPath) ||
      (isAdmin && isAdminPath) ||
      (isSuperAdmin && (isSuperAdminPath || isAdminPath))
    ) {
      return next();
    } else {
      throw new APIError("Forbidden", httpStatus.FORBIDDEN);
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;

// Custom JWT-based auth middleware

// import { APIError } from "../utils/index.js";
// import httpStatus from "http-status";
// import type { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import config from "../config/config.js";
// import type { JwtPayload } from "../types/jwt.js";

// const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   console.log("Auth Midddleware", req.baseUrl);
//   const isAdminPath = req.baseUrl.includes("/admin");
//   console.log("isAdminPath", isAdminPath);
//   const isSuperAdminPath = req.baseUrl.includes("/super-admin");

//   let token;
//   if (isAdminPath || isSuperAdminPath) {
//     token = req.cookies.adminAuth;
//   } else {
//     // token = req.cookies.auth;
//     token = req.cookies["better-auth.session_token"];
//   }
//   if (!token) throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);

//   let userData;
//   try {
//     userData = jwt.verify(token, config.jwtSecret) as JwtPayload;
//     console.log("User Data:", userData);
//   } catch (error) {
//     console.error("JWT Verification Error:", error);
//     throw new APIError("Unauthorized", httpStatus.UNAUTHORIZED);
//   }

//   req.user = userData;

//   // Role-based access
//   const isAdmin = userData.role === "admin" || userData.role === "super-admin";
//   const isSuperAdmin = userData.role == "super-admin";

//   if (
//     (!isAdmin && !isAdminPath) ||
//     (isAdmin && isAdminPath) ||
//     (isSuperAdmin && (isSuperAdminPath || isAdminPath))
//   ) {
//     return next(); // allowed
//   } else {
//     throw new APIError("Forbidden", httpStatus.FORBIDDEN);
//   }
// };

// export default authMiddleware;

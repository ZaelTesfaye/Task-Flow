import { APIError } from "../utils/index.js";
import httpStatus from "http-status";
import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isAdminPath = req.baseUrl.includes("/admin");

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

    const role = session.user.role ?? "user";
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role,
    };

    if (isAdminPath && role !== "admin") {
      throw new APIError("Forbidden", httpStatus.FORBIDDEN);
    }

    return next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;

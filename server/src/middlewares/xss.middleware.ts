import xss from "xss";
import type { Request, Response, NextFunction } from "express";

/**
 * Recursively sanitize all string values in an object/array using xss().
 */
const sanitize = (data: unknown): unknown => {
  if (typeof data === "string") {
    return xss(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  if (data !== null && typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitize(value);
    }
    return sanitized;
  }

  return data;
};

/**
 * Express middleware that sanitizes req.body, req.query, and req.params
 * to prevent XSS attacks by stripping/escaping malicious HTML/script tags.
 */
const xssMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query) as Record<string, any>;
  if (req.params) req.params = sanitize(req.params) as Record<string, string>;
  next();
};

export default xssMiddleware;

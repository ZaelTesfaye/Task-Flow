import xss from "xss";
import type { Request, Response, NextFunction } from "express";

const sanitize = (data: unknown): unknown => {
  if (typeof data === "string") return xss(data);
  if (Array.isArray(data)) return data.map(sanitize);
  if (data !== null && typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitize(value);
    }
    return sanitized;
  }
  return data;
};

const xssMiddleware = (req: Request, _: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = sanitize(req.body);
  }

  if (req.query) {
    const sanitized = sanitize(req.query) as Record<string, unknown>;
    for (const key of Object.keys(sanitized)) {
      (req.query as Record<string, unknown>)[key] = sanitized[key];
    }
  }

  if (req.params) {
    req.params = sanitize(req.params) as Record<string, string>;
  }

  next();
};

export default xssMiddleware;

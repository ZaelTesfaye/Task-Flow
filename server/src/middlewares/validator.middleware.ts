import { status } from "http-status";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { APIError } from "../utils/index.js";

interface ValidationSchema {
  body?: z.ZodSchema<any>;
  query?: z.ZodSchema<any>;
  params?: z.ZodSchema<any>;
}

const validate =
  (schema: ValidationSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          return next(new APIError(result.error.issues[0]?.message || "Invalid body", status.BAD_REQUEST));
        }
        req.body = result.data;
      }

      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          return next(new APIError(result.error.issues[0]?.message || "Invalid query parameters", status.BAD_REQUEST));
        }
        req.query = result.data;
      }

      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          return next(new APIError(result.error.issues[0]?.message || "Invalid path parameters", status.BAD_REQUEST));
        }
        req.params = result.data;
      }

      next();
    } catch {
      return next(new APIError("Validation error", status.BAD_REQUEST));
    }
  };

export default validate;

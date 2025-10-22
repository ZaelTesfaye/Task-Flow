import { APIError } from "../utils/error.ts";
import { status } from "http-status";
import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";

interface ValidationSchema {
  body?: ObjectSchema<any>;
  query?: ObjectSchema<any>;
  params?: ObjectSchema<any>;
}

const validate =
  (schema: ValidationSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, {
        abortEarly: true,
      });
      if (error) {
        return next(new APIError(error.message, status.BAD_REQUEST));
      }
      req.body = value;
    }

    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, {
        abortEarly: true,
      });
      if (error) {
        return next(new APIError(error.message, status.BAD_REQUEST));
      }
      req.query = value;
    }

    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, {
        abortEarly: true,
      });
      if (error) {
        return next(new APIError(error.message, status.BAD_REQUEST));
      }
      req.params = value;
    }
    next();
  };

export default validate;
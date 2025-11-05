import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

import { logger } from "../lib/index.js";
import { APIError } from "../utils/index.js";

const errorHandler = (
  error: Error | APIError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.debug(error.message, error);

  if (error instanceof APIError) {
    if (error.statusCode === httpStatus.INTERNAL_SERVER_ERROR)
      logger.error(error.message, error);

    return res.status(error.statusCode).json({
      status: false,
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000": // Value too long
        logger.error(error.message, error);
        return res.status(httpStatus.BAD_REQUEST).json({
          status: false,
          message: "Value too long",
        });

      case "P2002": // Unique constraint failed
        return res.status(httpStatus.CONFLICT).json({
          status: false,
          message: "Resource already exists",
        });

      case "P2033": // Number out of range
        return res.status(httpStatus.BAD_REQUEST).json({
          status: false,
          message: "Number out of range",
        });

      case "P2025": // Record not found
        return res.status(httpStatus.NOT_FOUND).json({
          status: false,
          message: "Resource not found",
        });

      default:
        logger.error(error.message, error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: false,
          message: "An error occurred",
        });
    }
  }

  logger.error(error.message, error);

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    status: false,
    message: "An error occurred",
  });
};

export default errorHandler;

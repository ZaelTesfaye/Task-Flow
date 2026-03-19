import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { logger } from "../lib/index.js";
import { APIError } from "../utils/index.js";

const errorHandler = (
  error: Error | APIError | Prisma.PrismaClientKnownRequestError | unknown,
  req: Request,
  res: Response,
) => {
  if (error instanceof Error) logger.debug(error.message, error);
  else logger.debug(error);

  if (error instanceof APIError) {
    if (error.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      logger.error(error.message, error);
    }

    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000": // Value too long
        logger.error(error.message, error);
        return res.status(httpStatus.BAD_REQUEST).json({
          message: "Value too long",
        });

      case "P2002": // Unique constraint failed
        return res.status(httpStatus.CONFLICT).json({
          message: "Resource already exists",
        });

      case "P2033": // Number out of range
        return res.status(httpStatus.BAD_REQUEST).json({
          message: "Number out of range",
        });

      case "P2025": // Record not found
        return res.status(httpStatus.NOT_FOUND).json({
          message: "Resource not found",
        });

      default:
        logger.error(error.message, error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          message: "An error occurred",
        });
    }
  }

  if (error instanceof Error) logger.error(error.message, error);
  else logger.error(error);

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "An error occurred",
  });
};

export default errorHandler;

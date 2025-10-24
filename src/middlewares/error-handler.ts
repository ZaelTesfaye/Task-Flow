import { APIError } from "../utils/error.js";
import httpStatus from "http-status";
import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import logger from "../lib/logger.js";

const errorHandler = (
  error: Error | APIError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof APIError) {
    if (error.statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
      {
        logger.error(error);
      }

      return res.status(error.statusCode).json({
        status: false,
        message: error.message,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2000": // Value too long
          logger.error(error);
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
          logger.error(error);
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
          logger.error(error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: "An error occurred",
          });
      }
    }

    logger.error(error);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "An error occurred",
    });
  }
};

export default errorHandler;

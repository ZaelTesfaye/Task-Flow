import type { Request, Response } from "express";
import httpStatus from "http-status";

const notFoundHandler = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: "Not Found!",
  });
};

export default notFoundHandler;

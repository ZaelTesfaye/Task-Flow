import type { Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: "Not Found!",
  });
}

export default notFoundHandler;
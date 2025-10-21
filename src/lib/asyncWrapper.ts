
import type { Request, Response, NextFunction, RequestHandler } from "express";

const asyncWrapper = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => fn(req, res, next))
      .catch(next);
  };
};

export default asyncWrapper;
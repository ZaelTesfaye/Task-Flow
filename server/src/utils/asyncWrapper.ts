import type { Request, Response, NextFunction, RequestHandler } from "express";

const asyncWrapper = <P>(fn: RequestHandler<P>): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req as Request<P>, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncWrapper;

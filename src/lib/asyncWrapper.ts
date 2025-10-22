
import type { Request, Response, NextFunction, RequestHandler } from "express";

const asyncWrapper = <P = any> (fn: RequestHandler<P>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => fn(req as Request<P>, res, next))
      .catch(next);
  };
};

export default asyncWrapper;
import type { Request, Response, NextFunction } from "express";
declare const asyncWrapper: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export default asyncWrapper;
//# sourceMappingURL=asyncWrapper.d.ts.map
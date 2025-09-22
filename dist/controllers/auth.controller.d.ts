import type { Request, Response } from 'express';
declare const authControllers: {
    register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    login: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
};
export default authControllers;
//# sourceMappingURL=auth.controller.d.ts.map
import type { Request, Response, NextFunction } from 'express';
declare const userControllers: {
    addTask: (req: Request, res: Response, next: NextFunction) => void;
    removeTask: (req: Request, res: Response, next: NextFunction) => void;
    updateTaskStatus: (req: Request, res: Response, next: NextFunction) => void;
    getTasks: (req: Request, res: Response, next: NextFunction) => void;
};
export default userControllers;
//# sourceMappingURL=task.controllers.d.ts.map
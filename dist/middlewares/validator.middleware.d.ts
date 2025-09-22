import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
interface ValidationSchema {
    body?: ObjectSchema<any>;
    query?: ObjectSchema<any>;
    params?: ObjectSchema<any>;
}
declare const validate: (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => void;
export default validate;
//# sourceMappingURL=validator.middleware.d.ts.map
import { APIError } from '../utils/error.js';
import httpStatus from 'http-status';
import type {Request, Response, NextFunction}  from 'express'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies.auth;
    if (!token) {
        console.log("No token found");
        // next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED));
        throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED);
    }
    next();
}

export default authMiddleware;

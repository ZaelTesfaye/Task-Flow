import { APIError } from '../utils/error.js';
import httpStatus from 'http-status';
import type {Request, Response, NextFunction}  from 'express'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies.auth;
    if (!token) {
        next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED));
    }
}

export default authMiddleware;

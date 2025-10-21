import { APIError } from '../utils/error.js';
import httpStatus from 'http-status';
import type {Request, Response, NextFunction}  from 'express'
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth;
    if (!token) {
        console.log("No token found");
        throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED);
    }

    try {
        const userData = jwt.verify(token, config.jwtSecret);
    } catch (error) {
         throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED);
    }

    next();

}

export default authMiddleware;

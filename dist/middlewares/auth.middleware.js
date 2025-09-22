import { APIError } from '../utils/error.js';
import httpStatus from 'http-status';
const authMiddleware = (req, res, next) => {
    const token = req.signedCookies.auth;
    if (!token) {
        next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED));
    }
};
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map
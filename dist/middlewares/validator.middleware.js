import { APIError } from "../utils/error.js";
import { status } from "http-status";
const validate = (schema) => (req, res, next) => {
    if (schema.body) {
        const { error, value } = schema.body.validate(req.body, {
            abortEarly: true,
        });
        if (error) {
            return next(new APIError(error.message, status.BAD_REQUEST));
        }
        req.body = value;
    }
    if (schema.query) {
        const { error, value } = schema.query.validate(req.query, {
            abortEarly: true,
        });
        if (error) {
            return next(new APIError(error.message, status.BAD_REQUEST));
        }
        req.query = value;
    }
    if (schema.params) {
        const { error, value } = schema.params.validate(req.params, {
            abortEarly: true,
        });
        if (error) {
            return next(new APIError(error.message, status.BAD_REQUEST));
        }
        req.params = value;
    }
    next();
};
export default validate;
//# sourceMappingURL=validator.middleware.js.map
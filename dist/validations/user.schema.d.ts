import joi from "joi";
import type { AddUserBody } from "../dtos/user.dto.js";
declare const userSchemas: {
    addUserSchema: {
        body: joi.ObjectSchema<AddUserBody>;
    };
};
export default userSchemas;
//# sourceMappingURL=user.schema.d.ts.map
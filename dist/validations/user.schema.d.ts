import joi from "joi";
import type { AddUserBody } from "../src/dtos/user.dto.ts";
declare const userSchemas: {
    addUserSchema: {
        body: joi.ObjectSchema<AddUserBody>;
    };
};
export default userSchemas;
//# sourceMappingURL=user.schema.d.ts.map
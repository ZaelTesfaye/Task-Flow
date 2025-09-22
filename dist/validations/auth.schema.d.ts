import joi from "joi";
declare const authSchemas: {
    registerSchema: {
        body: joi.ObjectSchema<any>;
    };
    loginSchema: {
        body: joi.ObjectSchema<any>;
    };
};
export default authSchemas;
//# sourceMappingURL=auth.schema.d.ts.map
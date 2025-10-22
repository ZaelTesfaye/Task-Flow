import { APIError } from "../utils/error.ts";
import envSchema, { type EnvSchemaType } from "../validations/env.validation.ts";

const { value, error } = envSchema.validate(process.env);


if (error) {
  throw new APIError(`Config validation error: ${error.message}`, 500);
}

const envVars : EnvSchemaType  = value as EnvSchemaType;

const env = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  jwtSecret: envVars.JWT_SECRET,
  frontEndUrl: envVars.FRONTEND_URL,
  adminName: envVars.ADMIN_NAME,
  adminEmail: envVars.ADMIN_EMAIL,
  adminPassword: envVars.ADMIN_PASSWORD
};

export default env;
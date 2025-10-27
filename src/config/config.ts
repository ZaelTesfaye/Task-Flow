import { APIError } from "../utils/error.js";
import envSchema, {
  type EnvSchemaType,
} from "../validations/env.validation.js";

const { value, error } = envSchema.validate(process.env);

if (error) {
  throw new APIError(`Config validation error: ${error.message}`, 500);
}

const envVars = value as EnvSchemaType;

const env = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  jwtSecret: envVars.JWT_SECRET,
  frontEndUrl: envVars.FRONTEND_URL,
  adminName: envVars.ADMIN_NAME,
  adminEmail: envVars.ADMIN_EMAIL,
  adminPassword: envVars.ADMIN_PASSWORD,
};

export default env;

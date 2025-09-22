import envSchema from "../validations/env.validation.js";
import { type EnvSchemaType } from "../validations/env.validation.js";
const { value, error } = envSchema.validate(process.env);

const envVars : EnvSchemaType | null = value as EnvSchemaType;

if (error) {
  console.log(`Config validation error: ${error.message}`);
  process.exit(1);
}

const env = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  jwtSecret: envVars.JWT_SECRET,
  cookieSecret: envVars.COOKIE_SECRET,
};

export default env;
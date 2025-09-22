import envSchema from '../validations/env.schema.js';
const {value, error} = envSchema.validate(process.env);

if (error) {
    console.log(`Config validation error: ${error.message}`);
    process.exit(1);
}

const env = {
    port : value.PORT,
    env : value.NODE_ENV,
    jwtSecret : value.JWT_SECRET,
    cookieSecret: value.COOKIE_SECRET,
}

export default env;
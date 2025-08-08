const envSchema = require('../validations/env.schema');

const {value, error} = envSchema.validate(process.env);

if (error) {
    console.log(`Config validation error: ${error.message}`);
    process.exit(1);
}

module.exports = {
    port : value.PORT,
    env : value.NODE_ENV
}
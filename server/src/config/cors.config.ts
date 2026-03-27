import env from "./env.config.js";

const allowedOrigins = env.frontEndUrl?.split(",")?.map((o: string) => o.trim());

export const CorsOptions = {
  origin: env.nodeEnv === "development" ? true : allowedOrigins,
  credentials: true,
};

export default CorsOptions;

import { env } from "./index.js";

const allowedOrigins = env.frontEndUrl?.split(",")?.map((o) => o.trim());

const CorsOptions = {
  origin: env.nodeEnv === "development" ? true : allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

export default CorsOptions;

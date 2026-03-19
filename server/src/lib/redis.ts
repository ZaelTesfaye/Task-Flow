import { Redis } from "ioredis";
import config from "../config/env.config.js";

const redisUrl = config.redisUrl;

const redis = new Redis(redisUrl);

export default redis;

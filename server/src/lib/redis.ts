import { Redis } from "ioredis";
import config from "../config/config.js";

const redisUrl = config.redisUrl;

const redis = new Redis(redisUrl);

export default redis;

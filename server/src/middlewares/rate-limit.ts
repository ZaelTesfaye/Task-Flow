import { RateLimiterRedis } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";
import redis from "../lib/redis.js";
import { APIError } from "../utils/index.js";
import httpStatus from "http-status";
import logger from "../lib/logger.js";

const MAX_SHORT_BURST = 5; // 5 attempts / 10 min per email
const MAX_MEDIUM_WINDOW = 15; // 15 attempts per hour per email

// Short burst
const shortBurstLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:auth:burst",
  points: MAX_SHORT_BURST,
  duration: 60 * 10, // 10 minutes
  blockDuration: 60 * 15, // block 15 min
});

// wide window
const mediumWindowLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:auth:medium",
  points: MAX_MEDIUM_WINDOW,
  duration: 60 * 60, // 1 hour
  blockDuration: 60 * 60, // block 1 hour
});

// check email+IP before allowing login
export const authRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body?.email?.toLowerCase();
  if (!email) return next();

  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const key = `${email}_${ip}`;

  try {
    const [burstRes, mediumRes] = await Promise.all([shortBurstLimiter.get(key), mediumWindowLimiter.get(key)]);

    let retrySeconds = 0;

    if (mediumRes && mediumRes.consumedPoints >= MAX_MEDIUM_WINDOW) {
      retrySeconds = Math.ceil(mediumRes.msBeforeNext / 1000) || 1;
    } else if (burstRes && burstRes.consumedPoints >= MAX_SHORT_BURST) {
      retrySeconds = Math.ceil(burstRes.msBeforeNext / 1000) || 1;
    }

    if (retrySeconds > 0) {
      res.set("Retry-After", String(retrySeconds));
      throw new APIError("Too many login attempts, please try again later", httpStatus.TOO_MANY_REQUESTS);
    }

    next();
  } catch (error) {
    if (error instanceof APIError) return next(error);
    logger.error(`Error on authRateLimiter: ${error}`);
    next();
  }
};

// Consume a point on all limiters for a failed login.
export const consumeAuthRateLimit = async (email: string, ip: string): Promise<void> => {
  const key = `${email.toLowerCase()}_${ip}`;
  await Promise.allSettled([shortBurstLimiter.consume(key), mediumWindowLimiter.consume(key)]);
};

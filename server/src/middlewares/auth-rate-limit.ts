import { RateLimiterRedis } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";
import redis from "../lib/redis.js";
import { APIError } from "../utils/index.js";

// --- Config ---
const MAX_SHORT_BURST = 5; // 5 attempts per 10 minutes per email
const MAX_MEDIUM_WINDOW = 15; // 15 attempts per hour per email
const MAX_DAILY = 50; // 50 attempts per day per email

// Short burst: 5 failed attempts in 10 min -> block for 15 min
const shortBurstLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:auth:burst",
  points: MAX_SHORT_BURST,
  duration: 60 * 10, // 10 minutes
  blockDuration: 60 * 15, // block 15 min
});

// Medium window: 15 failed attempts in 1 hour -> block for 1 hour
const mediumWindowLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:auth:medium",
  points: MAX_MEDIUM_WINDOW,
  duration: 60 * 60, // 1 hour
  blockDuration: 60 * 60, // block 1 hour
});

// Daily limiter: 50 failed attempts in 24h -> block for 24h
const dailyLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:auth:daily",
  points: MAX_DAILY,
  duration: 60 * 60 * 24, // 24 hours
  blockDuration: 60 * 60 * 24, // block 24 hours
});

/**
 * Middleware: check if email+IP combo is rate-limited before allowing login.
 * Keyed on email+IP so an attacker can't lock out a legitimate user from a different IP.
 */
export const authRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body?.email?.toLowerCase();
  if (!email) return next();

  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const key = `${email}_${ip}`;

  try {
    const [burstRes, mediumRes, dailyRes] = await Promise.all([
      shortBurstLimiter.get(key),
      mediumWindowLimiter.get(key),
      dailyLimiter.get(key),
    ]);

    let retrySeconds = 0;

    if (dailyRes && dailyRes.consumedPoints >= MAX_DAILY) {
      retrySeconds = Math.ceil(dailyRes.msBeforeNext / 1000) || 1;
    } else if (mediumRes && mediumRes.consumedPoints >= MAX_MEDIUM_WINDOW) {
      retrySeconds = Math.ceil(mediumRes.msBeforeNext / 1000) || 1;
    } else if (burstRes && burstRes.consumedPoints >= MAX_SHORT_BURST) {
      retrySeconds = Math.ceil(burstRes.msBeforeNext / 1000) || 1;
    }

    if (retrySeconds > 0) {
      res.set("Retry-After", String(retrySeconds));
      throw new APIError("Too many login attempts, please try again later", 429);
    }

    next();
  } catch (error) {
    if (error instanceof APIError) return next(error);
    // If Redis is down, let request through (fail-open)
    next();
  }
};

/**
 * Consume a point on all limiters for a failed login.
 * Call this in the auth service when login fails.
 * @param email - the email used in the login attempt
 * @param ip - the IP address of the requester
 */
export const consumeAuthRateLimit = async (email: string, ip: string): Promise<void> => {
  const key = `${email.toLowerCase()}_${ip}`;
  await Promise.allSettled([
    shortBurstLimiter.consume(key),
    mediumWindowLimiter.consume(key),
    dailyLimiter.consume(key),
  ]);
};

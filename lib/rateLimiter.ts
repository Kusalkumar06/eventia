import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | undefined;

try {
  redis = Redis.fromEnv();
} catch (error: unknown) {
  console.warn("Redis not configured. Rate limiting is disabled.", error);
}

const createLimiter = (limiter: ConstructorParameters<typeof Ratelimit>[0]["limiter"]) => {
  if (redis) {
    return new Ratelimit({
      redis,
      limiter,
    });
  }
  return {
    limit: async () => ({ success: true, limit: 100, remaining: 100, reset: 0 }),
  };
};


export const otpVerifyLimiter = createLimiter(
  Ratelimit.slidingWindow(5, "5 m") 
);


export const otpResendLimiter = createLimiter(
  Ratelimit.slidingWindow(3, "5 m") 
);


export const loginLimiter = createLimiter(
  Ratelimit.slidingWindow(10, "5 m") 
);

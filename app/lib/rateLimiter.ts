import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// OTP verification limiter
export const otpVerifyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"), // 5 attempts per 5 minutes
});

// OTP resend limiter
export const otpResendLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "5 m"), // 3 resends per 5 minutes
});

// Login limiter
export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "5 m"), // 10 login attempts per 5 minutes
});

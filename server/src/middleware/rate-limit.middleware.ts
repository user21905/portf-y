import rateLimit from "express-rate-limit";
import {
  CONTACT_RATE_MAX,
  CONTACT_RATE_WINDOW_MS,
  LOGIN_RATE_MAX,
  LOGIN_RATE_WINDOW_MS,
} from "../config/security.constants.js";

export const contactFormRateLimiter = rateLimit({
  windowMs: CONTACT_RATE_WINDOW_MS,
  max: CONTACT_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Çok fazla mesaj gönderildi. Lütfen daha sonra tekrar deneyin." },
});

export const loginRateLimiter = rateLimit({
  windowMs: LOGIN_RATE_WINDOW_MS,
  max: LOGIN_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Çok fazla giriş denemesi. Lütfen bir süre sonra tekrar deneyin." },
});

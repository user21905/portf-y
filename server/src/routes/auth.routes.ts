import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { authService, getCookieOptions, COOKIE_NAME } from "../services/auth.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { loginRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

const loginValidators = [
  body("username").trim().notEmpty().withMessage("Kullanıcı adı gerekli"),
  body("password").notEmpty().withMessage("Şifre gerekli"),
];

router.post(
  "/login",
  loginRateLimiter,
  validate(loginValidators),
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    if (!result) {
      res.status(401).json({ error: "Kullanıcı adı veya şifre hatalı" });
      return;
    }
    res.cookie(COOKIE_NAME, result.token, getCookieOptions());
    res.json({ success: true });
  }
);

router.post("/logout", (_req, res): void => {
  res.clearCookie(COOKIE_NAME, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true });
});

router.get("/me", requireAuth, (req: Request & { admin?: { id: string; username: string } }, res): void => {
  res.json({ admin: req.admin });
});

export const authRoutes = router;

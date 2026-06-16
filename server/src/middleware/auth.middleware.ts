import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { authService, COOKIE_NAME } from "../services/auth.service.js";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME] ?? req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Yetkisiz erişim" });
    return;
  }
  const payload = authService.verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Geçersiz veya süresi dolmuş oturum" });
    return;
  }
  (req as Request & { admin?: { id: string; username: string } }).admin = {
    id: payload.sub,
    username: payload.username,
  };
  next();
}

export function attachCookieParser() {
  return cookieParser();
}

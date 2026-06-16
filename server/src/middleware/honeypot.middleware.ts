import type { Request, Response, NextFunction } from "express";
import { HONEYPOT_FIELD } from "../config/security.constants.js";

export function rejectHoneypot(req: Request, res: Response, next: NextFunction): void {
  const raw = req.body?.[HONEYPOT_FIELD];
  if (raw != null && String(raw).trim() !== "") {
    res.status(400).json({ error: "Geçersiz istek", code: "HONEYPOT" });
    return;
  }
  next();
}

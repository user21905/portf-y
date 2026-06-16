import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { COOKIE_NAME, TOKEN_EXPIRY } from "../config/constants.js";
import { adminRepository } from "../repositories/admin.repository.js";

const SALT_ROUNDS = 10;

export const authService = {
  async login(username: string, password: string): Promise<{ token: string } | null> {
    const admin = await adminRepository.findByUsername(username);
    if (!admin) return null;
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return null;
    const token = jwt.sign(
      { sub: admin.id, username: admin.username },
      env.jwtSecret,
      { expiresIn: TOKEN_EXPIRY }
    );
    return { token };
  },

  verifyToken(token: string): { sub: string; username: string } | null {
    try {
      const payload = jwt.verify(token, env.jwtSecret) as { sub: string; username: string };
      return payload;
    } catch {
      return null;
    }
  },

  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  },
};

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  };
}

export { COOKIE_NAME };

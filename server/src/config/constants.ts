export const COOKIE_NAME = "portfolio_admin_token";
export const TOKEN_EXPIRY = "7d";

export const SKILL_CATEGORIES = ["core", "frontend", "backend", "protocols", "language", "web", "concept"] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

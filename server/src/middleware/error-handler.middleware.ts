import type { ErrorRequestHandler } from "express";
import { ClientValidationError } from "../errors/client-validation.error.js";
import { HttpError } from "../errors/http.error.js";

function isBodyParserSyntaxError(err: unknown): boolean {
  if (!(err instanceof SyntaxError) || typeof err !== "object" || err === null) return false;
  const e = err as Error & { status?: number; type?: string };
  return e.status === 400 && e.type === "entity.parse.failed";
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ClientValidationError) {
    res.status(400).json({ error: err.message, code: "VALIDATION" });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.code ? { code: err.code } : {}),
    });
    return;
  }

  if (isBodyParserSyntaxError(err as Error)) {
    res.status(400).json({ error: "Geçersiz JSON gövdesi", code: "INVALID_JSON" });
    return;
  }

  console.error("[error]", err);
  res.status(500).json({ error: "Sunucu hatası", code: "INTERNAL" });
};

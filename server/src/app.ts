import express from "express";
import path from "node:path";
import cors from "cors";
import { env } from "./config/env.js";
import { attachCookieParser } from "./middleware/auth.middleware.js";
import { publicRoutes } from "./routes/public.routes.js";
import { contactRoutes } from "./routes/contact.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { serveRobots, serveSitemap } from "./routes/seo.routes.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { CLIENT_DIST_DIR, clientDistExists } from "./lib/client-dist.js";

const app = express();

app.set("trust proxy", 1);

app.get("/sitemap.xml", (req, res) => {
  void serveSitemap(req, res);
});
app.get("/robots.txt", (req, res) => {
  void serveRobots(req, res);
});

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(attachCookieParser());

app.use("/api", publicRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

if (env.isProduction && clientDistExists()) {
  app.use(express.static(CLIENT_DIST_DIR, { index: false, maxAge: "1d" }));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(CLIENT_DIST_DIR, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.use((_req, res) => {
  res.status(404).json({ error: "Bulunamadı" });
});

app.use(errorHandler);

export default app;

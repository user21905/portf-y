import { Router } from "express";
import { contentService } from "../services/content.service.js";

const router = Router();

router.get("/content", async (_req, res, next) => {
  try {
    const content = await contentService.getPublicContent();
    res.json(content);
  } catch (e) {
    next(e);
  }
});

router.get("/projects/:slug", async (req, res, next) => {
  try {
    const project = await contentService.getProjectBySlug(req.params.slug);
    if (!project) {
      res.status(404).json({ error: "Proje bulunamadı" });
      return;
    }
    res.json(project);
  } catch (e) {
    next(e);
  }
});

export const publicRoutes = router;

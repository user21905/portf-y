import { Router } from "express";
import { body, param } from "express-validator";
import { contentService } from "../services/content.service.js";
import { dashboardService } from "../services/dashboard.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/dashboard", async (_req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (e) {
    next(e);
  }
});

router.get("/content", async (_req, res, next) => {
  try {
    const content = await contentService.getPublicContent();
    res.json(content);
  } catch (e) {
    next(e);
  }
});

router.get("/home", async (_req, res, next) => {
  try {
    const home = await contentService.getHome();
    res.json(home ?? null);
  } catch (e) {
    next(e);
  }
});

const homeValidators = [
  body("fullName").trim().notEmpty(),
  body("introText").trim().notEmpty(),
  body("headline").optional().trim(),
  body("ctaButtonText").optional().trim(),
];
router.put("/home", validate(homeValidators), async (req, res, next) => {
  try {
    const data = await contentService.updateHome(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/about", async (_req, res, next) => {
  try {
    const about = await contentService.getAbout();
    res.json(about ?? null);
  } catch (e) {
    next(e);
  }
});
router.put("/about", validate([body("body").trim().notEmpty()]), async (req, res, next) => {
  try {
    const data = await contentService.updateAbout(req.body.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/settings", async (_req, res, next) => {
  try {
    const settings = await contentService.getSettings();
    res.json(settings ?? null);
  } catch (e) {
    next(e);
  }
});
const settingsValidators = [
  body("siteTitle").optional().trim(),
  body("siteDesc").optional().trim(),
  body("githubUrl").optional({ values: "falsy" }).trim(),
  body("linkedinUrl").optional({ values: "falsy" }).trim(),
  body("twitterUrl").optional({ values: "falsy" }).trim(),
  body("metaKeywords").optional().trim(),
  body("ogImageUrl").optional().trim(),
  body("ogImageAlt").optional().trim(),
  body("twitterCreator").optional().trim(),
  body("canonicalBaseUrl").optional().trim(),
];
router.put("/settings", validate(settingsValidators), async (req, res, next) => {
  try {
    const data = await contentService.updateSettings(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/page-content", async (_req, res, next) => {
  try {
    const pageContent = await contentService.getPageContent();
    res.json(pageContent ?? null);
  } catch (e) {
    next(e);
  }
});

const pageContentValidators = [
  body("heroBadge").optional().trim(),
  body("aboutSecondaryCtaLabel").optional().trim(),
  body("nowEyebrow").optional().trim(),
  body("nowTitle").optional().trim(),
  body("nowSubtitle").optional().trim(),
  body("nowCards").optional().isArray(),
  body("nowCards.*.title").optional().trim(),
  body("nowCards.*.description").optional().trim(),
  body("spotlightProjectSlug").optional().trim(),
  body("spotlightEyebrow").optional().trim(),
  body("spotlightTitle").optional().trim(),
  body("featuredEyebrow").optional().trim(),
  body("featuredTitle").optional().trim(),
  body("featuredSubtitle").optional().trim(),
  body("partnershipsTitle").optional().trim(),
  body("partnershipsBody").optional().trim(),
  body("contactEmail").optional({ values: "falsy" }).trim().isEmail(),
  body("contactLocation").optional().trim(),
  body("contactReplyTime").optional().trim(),
  body("contactDirectTitle").optional().trim(),
  body("contactDirectIntro").optional().trim(),
  body("contactPageIntro").optional().trim(),
];
router.put("/page-content", validate(pageContentValidators), async (req, res, next) => {
  try {
    const data = await contentService.updatePageContent(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/education", async (_req, res, next) => {
  try {
    const education = await contentService.getEducation();
    res.json(education ?? null);
  } catch (e) {
    next(e);
  }
});
const educationValidators = [
  body("university").trim().notEmpty(),
  body("department").trim().notEmpty(),
  body("courses").trim().notEmpty(),
];
router.put("/education", validate(educationValidators), async (req, res, next) => {
  try {
    const data = await contentService.updateEducation(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/skills", async (_req, res, next) => {
  try {
    const skills = await contentService.getSkills();
    res.json(skills);
  } catch (e) {
    next(e);
  }
});
const skillValidators = [
  body("name").trim().notEmpty(),
  body("category").trim().notEmpty(),
  body("orderNum").optional().isInt(),
];
router.post("/skills", validate(skillValidators), async (req, res, next) => {
  try {
    const data = await contentService.createSkill(req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});
router.put(
  "/skills/:id",
  validate([param("id").notEmpty(), ...skillValidators.map((v) => v.optional())]),
  async (req, res, next) => {
    try {
      const data = await contentService.updateSkill(req.params.id, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
);
router.delete("/skills/:id", validate([param("id").notEmpty()]), async (req, res, next) => {
  try {
    await contentService.deleteSkill(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

router.get("/projects", async (_req, res, next) => {
  try {
    const projects = await contentService.getProjects();
    res.json(projects);
  } catch (e) {
    next(e);
  }
});
const projectValidators = [
  body("title").trim().notEmpty(),
  body("description").trim().notEmpty(),
  body("techStack").trim().notEmpty(),
  body("slug").optional().trim(),
  body("technologies").optional().trim(),
  body("challenge").optional().trim(),
  body("solution").optional().trim(),
  body("isFeatured").optional().isBoolean(),
  body("githubUrl").optional({ values: "falsy" }).trim(),
  body("demoUrl").optional({ values: "falsy" }).trim(),
  body("imageUrl").optional({ values: "falsy" }).trim(),
  body("imageAlt").optional({ values: "falsy" }).trim(),
  body("orderNum").optional().isInt(),
  body("caseStudyContent").optional({ values: "falsy" }).trim(),
];
router.post("/projects", validate(projectValidators), async (req, res, next) => {
  try {
    const data = await contentService.createProject(req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});
router.put(
  "/projects/:id",
  validate([param("id").notEmpty(), ...projectValidators.map((v) => v.optional())]),
  async (req, res, next) => {
    try {
      const data = await contentService.updateProject(req.params.id, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
);
router.delete("/projects/:id", validate([param("id").notEmpty()]), async (req, res, next) => {
  try {
    await contentService.deleteProject(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

router.get("/messages", async (_req, res, next) => {
  try {
    const messages = await contentService.getMessages();
    res.json(messages);
  } catch (e) {
    next(e);
  }
});
router.patch("/messages/:id/read", validate([param("id").notEmpty()]), async (req, res, next) => {
  try {
    await contentService.markMessageRead(req.params.id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export const adminRoutes = router;

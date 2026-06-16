import { Router } from "express";
import { body } from "express-validator";
import { contentService } from "../services/content.service.js";
import { validate } from "../middleware/validation.middleware.js";
import { contactFormRateLimiter } from "../middleware/rate-limit.middleware.js";
import { rejectHoneypot } from "../middleware/honeypot.middleware.js";
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
  CONTACT_NAME_MIN_LENGTH,
  CONTACT_SUBJECT_MAX_LENGTH,
  HONEYPOT_FIELD,
} from "../config/security.constants.js";

const router = Router();

const contactValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Ad gerekli")
    .isLength({ min: CONTACT_NAME_MIN_LENGTH, max: CONTACT_NAME_MAX_LENGTH })
    .withMessage(`Ad ${CONTACT_NAME_MIN_LENGTH}-${CONTACT_NAME_MAX_LENGTH} karakter olmalı`),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-posta gerekli")
    .isEmail()
    .withMessage("Geçerli bir e-posta girin")
    .isLength({ max: 254 })
    .withMessage("E-posta çok uzun"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Mesaj gerekli")
    .isLength({ min: CONTACT_MESSAGE_MIN_LENGTH, max: CONTACT_MESSAGE_MAX_LENGTH })
    .withMessage(
      `Mesaj ${CONTACT_MESSAGE_MIN_LENGTH}-${CONTACT_MESSAGE_MAX_LENGTH} karakter arasında olmalı`
    ),
  body("subject")
    .optional()
    .trim()
    .isLength({ max: CONTACT_SUBJECT_MAX_LENGTH })
    .withMessage("Konu çok uzun"),
  body(HONEYPOT_FIELD).optional(),
];

router.post(
  "/",
  contactFormRateLimiter,
  rejectHoneypot,
  validate(contactValidators),
  async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body;
      await contentService.createMessage({ name, email, subject, message });
      res.status(201).json({ success: true });
    } catch (e) {
      next(e);
    }
  }
);

export const contactRoutes = router;

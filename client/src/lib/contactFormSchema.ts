import { z } from "zod";

export const HONEYPOT_FIELD = "hp_company" as const;

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;
const NAME_MIN = 2;
const NAME_MAX = 120;
const SUBJECT_MAX = 200;

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(NAME_MIN, `Ad en az ${NAME_MIN} karakter olmalı`)
      .max(NAME_MAX, `Ad en fazla ${NAME_MAX} karakter olabilir`),
    email: z
      .string()
      .trim()
      .min(1, "E-posta gerekli")
      .email("Geçerli bir e-posta girin")
      .max(254, "E-posta çok uzun"),
    subject: z.string().trim().max(SUBJECT_MAX, "Konu çok uzun").optional(),
    message: z
      .string()
      .trim()
      .min(MESSAGE_MIN, `Mesaj en az ${MESSAGE_MIN} karakter olmalı`)
      .max(MESSAGE_MAX, `Mesaj en fazla ${MESSAGE_MAX} karakter olabilir`),
    [HONEYPOT_FIELD]: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hp = data[HONEYPOT_FIELD]?.trim();
    if (hp) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Geçersiz gönderim",
        path: [HONEYPOT_FIELD],
      });
    }
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;

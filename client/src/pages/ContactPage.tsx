import { useState } from "react";
import { PageLayout } from "@/components/Layout/PageLayout";
import { useContent } from "@/hooks/useContent";
import { contactApi } from "@/api/contact";
import { contactFormSchema, HONEYPOT_FIELD } from "@/lib/contactFormSchema";
import { Spinner } from "@/components/ui/Spinner";
import styles from "./ContactPage.module.css";

type FieldKey = "name" | "email" | "subject" | "message" | typeof HONEYPOT_FIELD;

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8v4l2.5 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactPage() {
  const { content } = useContent();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    [HONEYPOT_FIELD]: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (name in fieldErrors) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name as FieldKey];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const parsed = contactFormSchema.safeParse({
      name: formState.name,
      email: formState.email,
      subject: formState.subject,
      message: formState.message,
      [HONEYPOT_FIELD]: formState[HONEYPOT_FIELD],
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        subject: flat.subject?.[0],
        message: flat.message?.[0],
        [HONEYPOT_FIELD]: flat[HONEYPOT_FIELD]?.[0],
      });
      return;
    }

    setSubmitStatus("sending");
    try {
      const data = parsed.data;
      const sub = data.subject?.trim();
      await contactApi.send({
        name: data.name,
        email: data.email,
        subject: sub ? sub : undefined,
        message: data.message,
        hp_company: data[HONEYPOT_FIELD]?.trim() ?? "",
      });
      setSubmitStatus("success");
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
        [HONEYPOT_FIELD]: "",
      });
    } catch {
      setSubmitStatus("idle");
    }
  };

  if (!content) {
    return null;
  }

  const contactEmail = content.pageContent?.contactEmail ?? "celebiomerr1@gmail.com";
  const contactLocation = content.pageContent?.contactLocation ?? "Kuzey Kıbrıs";
  const contactReplyTime =
    content.pageContent?.contactReplyTime ?? "Genellikle 24 saat içinde dönüş yaparım";
  const contactDirectTitle =
    content.pageContent?.contactDirectTitle ?? "Doğrudan Bana Ulaş";
  const contactDirectIntro =
    content.pageContent?.contactDirectIntro ??
    "Form dışında doğrudan e-posta ile de ulaşabilirsiniz. Stratejik iş birlikleri, teknik danışmanlık ve kurumsal projeler için her zaman açığım.";
  const contactPageIntro =
    content.pageContent?.contactPageIntro ??
    "Yeni projeler, teknik ortaklıklar ve kurumsal iş birlikleri için açığım. Fikrinizi kısaca paylaşın; en kısa sürede size dönüş yapacağım.";
  const socialLinks = [
    { url: content.settings?.githubUrl, label: "GitHub" },
    { url: content.settings?.linkedinUrl, label: "LinkedIn" },
    { url: content.settings?.twitterUrl, label: "Twitter" },
  ].filter((l): l is { url: string; label: string } => Boolean(l.url?.trim()));

  return (
    <PageLayout settings={content.settings}>
      <div className="containerWide">
        <div className={styles.contactWrapper}>
          <h1 className={styles.title}>İletişim</h1>
          <p className={styles.subtitle}>{contactPageIntro}</p>

          <div className={styles.gridContainer}>
            <div className={styles.formColumn}>
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <label className={styles.label}>
                  Ad Soyad / Şirket
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className={styles.input}
                    autoComplete="name"
                    placeholder="Ad Soyad / Şirket Adı"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "err-name" : undefined}
                  />
                  {fieldErrors.name && (
                    <span id="err-name" className={styles.fieldError} role="alert">
                      {fieldErrors.name}
                    </span>
                  )}
                </label>
                <label className={styles.label}>
                  Kurumsal E-posta
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={styles.input}
                    autoComplete="email"
                    placeholder="ornek@sirket.com"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "err-email" : undefined}
                  />
                  {fieldErrors.email && (
                    <span id="err-email" className={styles.fieldError} role="alert">
                      {fieldErrors.email}
                    </span>
                  )}
                </label>
                <label className={styles.label}>
                  Konu / Proje Türü
                  <input
                    type="text"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Örn: MVP Geliştirme / Teknik Ortaklık"
                    aria-invalid={!!fieldErrors.subject}
                    aria-describedby={fieldErrors.subject ? "err-subject" : undefined}
                  />
                  {fieldErrors.subject && (
                    <span id="err-subject" className={styles.fieldError} role="alert">
                      {fieldErrors.subject}
                    </span>
                  )}
                </label>
                <label className={styles.label}>
                  Proje Detayları
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    className={styles.textarea}
                    placeholder="Proje veya iş birliği detaylarınızı, hedeflerinizi ve zaman çizelgenizi kısaca aktarın..."
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? "err-message" : undefined}
                  />
                  {fieldErrors.message && (
                    <span id="err-message" className={styles.fieldError} role="alert">
                      {fieldErrors.message}
                    </span>
                  )}
                </label>
                <div className={styles.honeypot} aria-hidden="true" tabIndex={-1}>
                  <label>
                    Şirket
                    <input
                      type="text"
                      name={HONEYPOT_FIELD}
                      value={formState[HONEYPOT_FIELD]}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>
                {submitStatus === "success" && (
                  <p className={styles.success}>
                    Talebiniz alındı. En kısa sürede size dönüş yapacağım.
                  </p>
                )}
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={submitStatus === "sending"}
                >
                  <span className={styles.submitInner}>
                    {submitStatus === "sending" && (
                      <Spinner size="sm" label="Gönderiliyor" />
                    )}
                    {submitStatus === "sending" ? "Gönderiliyor..." : "Talebi İlet"}
                  </span>
                </button>
              </form>
            </div>

            <aside className={styles.infoColumn}>
              <div className={styles.directPanel}>
                <h2 className={styles.infoSectionTitle}>{contactDirectTitle}</h2>
                <p className={styles.infoIntro}>{contactDirectIntro}</p>

                <div className={styles.infoCard}>
                  <div className={styles.infoIconWrap}>
                    <MailIcon />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>E-posta</span>
                    <a href={`mailto:${contactEmail}`} className={styles.infoLink}>
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIconWrap}>
                    <PinIcon />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>Konum</span>
                    <span className={styles.infoValue}>{contactLocation}</span>
                  </div>
                </div>

                {contactReplyTime.trim() && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoIconWrap}>
                      <ClockIcon />
                    </div>
                    <div className={styles.infoText}>
                      <span className={styles.infoLabel}>Yanıt süresi</span>
                      <span className={styles.infoValue}>{contactReplyTime}</span>
                    </div>
                  </div>
                )}

                <a href={`mailto:${contactEmail}`} className={styles.mailtoBtn}>
                  E-posta Gönder
                </a>
              </div>

              {socialLinks.length > 0 && (
                <div className={styles.socialCard}>
                  <h3 className={styles.socialTitle}>Profesyonel Ağlar</h3>
                  <div className={styles.socialButtons}>
                    {socialLinks.map(({ url, label }) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialBtn}
                      >
                        <span>{label}</span>
                        <ExternalIcon />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

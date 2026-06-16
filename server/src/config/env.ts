import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Firebase Admin kimlik bilgilerini okur.
 * Öncelik sırası:
 *   1) GOOGLE_APPLICATION_CREDENTIALS tanımlı ise service-account JSON dosyası kullanılır
 *      (firebase-admin otomatik applicationDefault ile yükler).
 *   2) Aksi halde üç env değişkeninden inline credential üretilir.
 */
function readFirebaseCredentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const gacPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

  if (gacPath) {
    return {
      mode: "application-default" as const,
      projectId: projectId ?? null,
    };
  }

  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error(
      "Firebase credentials eksik. GOOGLE_APPLICATION_CREDENTIALS veya " +
        "FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY tanımlayın."
    );
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

  return {
    mode: "inline" as const,
    projectId,
    clientEmail,
    privateKey,
  };
}

export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: requireEnv("JWT_SECRET"),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  publicSiteUrl: process.env.PUBLIC_SITE_URL ? trimTrailingSlash(process.env.PUBLIC_SITE_URL) : "",
  firebase: readFirebaseCredentials(),
} as const;

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import {
  FieldValue,
  Timestamp,
  getFirestore,
  type Firestore,
} from "firebase-admin/firestore";
import { env } from "../config/env.js";

/**
 * Firebase Admin uygulamasını tek sefer başlatır.
 * `firebase-admin/firestore` üzerinden paylaşılan bir `Firestore` örneği döner.
 *
 * Kimlik bilgileri iki şekilde verilebilir:
 *   - GOOGLE_APPLICATION_CREDENTIALS (service-account JSON dosya yolu)
 *   - FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY (inline)
 */
function createApp(): App {
  if (env.firebase.mode === "application-default") {
    return initializeApp({
      credential: applicationDefault(),
      ...(env.firebase.projectId ? { projectId: env.firebase.projectId } : {}),
    });
  }

  return initializeApp({
    credential: cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
    projectId: env.firebase.projectId,
  });
}

const app: App = getApps()[0] ?? createApp();

export const firestore: Firestore = getFirestore(app);
firestore.settings({ ignoreUndefinedProperties: true });

export { FieldValue, Timestamp };

/** Firestore Timestamp → ISO string dönüşümü (client ile tutarlı tarih biçimi). */
function toIsoIfTimestamp(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return value;
}

/** Bir doküman verisini Prisma-benzeri düz nesneye çevirir; Timestamp alanları ISO stringe dönüşür. */
export function mapDocToEntity<T extends { id: string }>(
  snapshot: FirebaseFirestore.DocumentSnapshot
): T | null {
  if (!snapshot.exists) return null;
  const raw = snapshot.data();
  if (!raw) return null;
  const out: Record<string, unknown> = { id: snapshot.id };
  for (const [key, value] of Object.entries(raw)) {
    out[key] = toIsoIfTimestamp(value);
  }
  return out as T;
}

/** `undefined` alanları siler (Firestore undefined'ı reddeder; `null` kullanılır). */
export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) out[key] = value;
  }
  return out as Partial<T>;
}

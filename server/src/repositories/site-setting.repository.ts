import { FieldValue, firestore, mapDocToEntity, stripUndefined } from "../lib/firebase.js";
import { COLLECTIONS, SINGLETON_DOC_ID, type SiteSetting } from "../types/entities.js";

const docRef = () => firestore.collection(COLLECTIONS.siteSettings).doc(SINGLETON_DOC_ID);

const defaults = {
  siteTitle: "Portföy",
  siteDesc: null as string | null,
  githubUrl: null as string | null,
  linkedinUrl: null as string | null,
  twitterUrl: null as string | null,
  metaKeywords: null as string | null,
  ogImageUrl: null as string | null,
  ogImageAlt: null as string | null,
  twitterCreator: null as string | null,
  canonicalBaseUrl: null as string | null,
};

export const siteSettingRepository = {
  async findFirst(): Promise<SiteSetting | null> {
    const snap = await docRef().get();
    return mapDocToEntity<SiteSetting>(snap);
  },

  async upsert(data: {
    siteTitle?: string;
    siteDesc?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    metaKeywords?: string | null;
    ogImageUrl?: string | null;
    ogImageAlt?: string | null;
    twitterCreator?: string | null;
    canonicalBaseUrl?: string | null;
  }): Promise<SiteSetting> {
    const existing = await docRef().get();
    const patch = stripUndefined(data as Record<string, unknown>);

    const payload = existing.exists
      ? patch
      : { ...defaults, ...patch };

    await docRef().set(
      { ...payload, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

    const snap = await docRef().get();
    const entity = mapDocToEntity<SiteSetting>(snap);
    if (!entity) throw new Error("SiteSetting upsert başarısız");
    return entity;
  },
};

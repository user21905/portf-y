import { FieldValue, firestore, mapDocToEntity, stripUndefined } from "../lib/firebase.js";
import { COLLECTIONS, SINGLETON_DOC_ID, type HomeContent } from "../types/entities.js";

const docRef = () => firestore.collection(COLLECTIONS.homeContent).doc(SINGLETON_DOC_ID);

const DEFAULT_HEADLINE = "Yazılım Mühendisliği Öğrencisi";
const DEFAULT_CTA = "Projelere Git";

export const homeContentRepository = {
  async findFirst(): Promise<HomeContent | null> {
    const snap = await docRef().get();
    return mapDocToEntity<HomeContent>(snap);
  },

  async upsert(data: {
    fullName: string;
    headline?: string;
    introText: string;
    ctaButtonText?: string;
  }): Promise<HomeContent> {
    const existing = await docRef().get();

    const payload = existing.exists
      ? stripUndefined({
          fullName: data.fullName,
          headline: data.headline,
          introText: data.introText,
          ctaButtonText: data.ctaButtonText,
        })
      : {
          fullName: data.fullName,
          headline: data.headline ?? DEFAULT_HEADLINE,
          introText: data.introText,
          ctaButtonText: data.ctaButtonText ?? DEFAULT_CTA,
        };

    await docRef().set(
      { ...payload, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

    const snap = await docRef().get();
    const entity = mapDocToEntity<HomeContent>(snap);
    if (!entity) throw new Error("HomeContent upsert başarısız");
    return entity;
  },
};

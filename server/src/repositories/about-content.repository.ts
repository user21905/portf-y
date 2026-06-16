import { FieldValue, firestore, mapDocToEntity } from "../lib/firebase.js";
import { COLLECTIONS, SINGLETON_DOC_ID, type AboutContent } from "../types/entities.js";

const docRef = () => firestore.collection(COLLECTIONS.aboutContent).doc(SINGLETON_DOC_ID);

export const aboutContentRepository = {
  async findFirst(): Promise<AboutContent | null> {
    const snap = await docRef().get();
    return mapDocToEntity<AboutContent>(snap);
  },

  async upsert(body: string): Promise<AboutContent> {
    await docRef().set(
      {
        body,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    const snap = await docRef().get();
    const entity = mapDocToEntity<AboutContent>(snap);
    if (!entity) throw new Error("AboutContent upsert başarısız");
    return entity;
  },
};

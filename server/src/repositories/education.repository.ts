import { FieldValue, firestore, mapDocToEntity } from "../lib/firebase.js";
import { COLLECTIONS, SINGLETON_DOC_ID, type Education } from "../types/entities.js";

const docRef = () => firestore.collection(COLLECTIONS.education).doc(SINGLETON_DOC_ID);

export const educationRepository = {
  async findFirst(): Promise<Education | null> {
    const snap = await docRef().get();
    return mapDocToEntity<Education>(snap);
  },

  async upsert(data: {
    university: string;
    department: string;
    courses: string;
  }): Promise<Education> {
    await docRef().set(
      {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    const snap = await docRef().get();
    const entity = mapDocToEntity<Education>(snap);
    if (!entity) throw new Error("Education upsert başarısız");
    return entity;
  },
};

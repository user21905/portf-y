import { FieldValue, firestore, mapDocToEntity } from "../lib/firebase.js";
import { COLLECTIONS, type Admin } from "../types/entities.js";

const col = () => firestore.collection(COLLECTIONS.admins);

export const adminRepository = {
  async findByUsername(username: string): Promise<Admin | null> {
    const snap = await col().where("username", "==", username).limit(1).get();
    if (snap.empty) return null;
    return mapDocToEntity<Admin>(snap.docs[0]);
  },

  async create(data: { username: string; password: string }): Promise<Admin> {
    const ref = col().doc();
    await ref.set({
      username: data.username,
      password: data.password,
      createdAt: FieldValue.serverTimestamp(),
    });
    const created = await ref.get();
    const entity = mapDocToEntity<Admin>(created);
    if (!entity) throw new Error("Admin oluşturulamadı");
    return entity;
  },
};

import { FieldValue, firestore, mapDocToEntity } from "../lib/firebase.js";
import { COLLECTIONS, type ContactMessage } from "../types/entities.js";

const col = () => firestore.collection(COLLECTIONS.contactMessages);

export const contactMessageRepository = {
  async findAll(): Promise<ContactMessage[]> {
    const snap = await col().orderBy("createdAt", "desc").get();
    return snap.docs
      .map((d) => mapDocToEntity<ContactMessage>(d))
      .filter((v): v is ContactMessage => v !== null);
  },

  async findById(id: string): Promise<ContactMessage | null> {
    const snap = await col().doc(id).get();
    return mapDocToEntity<ContactMessage>(snap);
  },

  async create(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<ContactMessage> {
    const ref = col().doc();
    await ref.set({
      name: data.name,
      email: data.email,
      subject: data.subject ?? null,
      message: data.message,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    const snap = await ref.get();
    const entity = mapDocToEntity<ContactMessage>(snap);
    if (!entity) throw new Error("ContactMessage oluşturulamadı");
    return entity;
  },

  async markAsRead(id: string): Promise<ContactMessage> {
    const ref = col().doc(id);
    await ref.update({ isRead: true });
    const snap = await ref.get();
    const entity = mapDocToEntity<ContactMessage>(snap);
    if (!entity) throw new Error("ContactMessage bulunamadı");
    return entity;
  },

  async countUnread(): Promise<number> {
    const snap = await col().where("isRead", "==", false).count().get();
    return snap.data().count;
  },
};

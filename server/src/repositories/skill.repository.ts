import { FieldValue, firestore, mapDocToEntity, stripUndefined } from "../lib/firebase.js";
import { COLLECTIONS, type Skill } from "../types/entities.js";

const col = () => firestore.collection(COLLECTIONS.skills);

export const skillRepository = {
  async findAll(): Promise<Skill[]> {
    const snap = await col().orderBy("orderNum", "asc").get();
    return snap.docs
      .map((d) => mapDocToEntity<Skill>(d))
      .filter((v): v is Skill => v !== null);
  },

  async findById(id: string): Promise<Skill | null> {
    const snap = await col().doc(id).get();
    return mapDocToEntity<Skill>(snap);
  },

  async create(data: { name: string; category: string; orderNum?: number }): Promise<Skill> {
    const ref = col().doc();
    await ref.set({
      name: data.name,
      category: data.category,
      orderNum: data.orderNum ?? 0,
      createdAt: FieldValue.serverTimestamp(),
    });
    const snap = await ref.get();
    const entity = mapDocToEntity<Skill>(snap);
    if (!entity) throw new Error("Skill oluşturulamadı");
    return entity;
  },

  async update(
    id: string,
    data: { name?: string; category?: string; orderNum?: number }
  ): Promise<Skill> {
    const ref = col().doc(id);
    const patch = stripUndefined(data);
    if (Object.keys(patch).length > 0) {
      await ref.update(patch);
    }
    const snap = await ref.get();
    const entity = mapDocToEntity<Skill>(snap);
    if (!entity) throw new Error("Skill bulunamadı");
    return entity;
  },

  async delete(id: string): Promise<Skill> {
    const ref = col().doc(id);
    const snap = await ref.get();
    const entity = mapDocToEntity<Skill>(snap);
    if (!entity) throw new Error("Skill bulunamadı");
    await ref.delete();
    return entity;
  },
};

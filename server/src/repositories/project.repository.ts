import { FieldValue, firestore, mapDocToEntity, stripUndefined } from "../lib/firebase.js";
import { COLLECTIONS, type Project } from "../types/entities.js";

const col = () => firestore.collection(COLLECTIONS.projects);

export const projectRepository = {
  async findAll(): Promise<Project[]> {
    const snap = await col().orderBy("orderNum", "asc").get();
    return snap.docs
      .map((d) => mapDocToEntity<Project>(d))
      .filter((v): v is Project => v !== null);
  },

  async findById(id: string): Promise<Project | null> {
    const snap = await col().doc(id).get();
    return mapDocToEntity<Project>(snap);
  },

  async findBySlug(slug: string): Promise<Project | null> {
    const snap = await col().where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    return mapDocToEntity<Project>(snap.docs[0]);
  },

  async create(data: {
    slug: string;
    title: string;
    description: string;
    techStack: string;
    technologies?: string | null;
    challenge?: string;
    solution?: string;
    isFeatured?: boolean;
    githubUrl?: string | null;
    demoUrl?: string | null;
    imageUrl?: string | null;
    imageAlt?: string | null;
    orderNum?: number;
    caseStudyContent?: string;
  }): Promise<Project> {
    const ref = col().doc();
    const now = FieldValue.serverTimestamp();
    const payload = {
      slug: data.slug,
      title: data.title,
      description: data.description,
      techStack: data.techStack,
      technologies: data.technologies ?? null,
      challenge: data.challenge ?? "",
      solution: data.solution ?? "",
      isFeatured: Boolean(data.isFeatured),
      githubUrl: data.githubUrl ?? null,
      demoUrl: data.demoUrl ?? null,
      imageUrl: data.imageUrl ?? null,
      imageAlt: data.imageAlt ?? null,
      orderNum: data.orderNum ?? 0,
      caseStudyContent: data.caseStudyContent ?? null,
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(payload);
    const snap = await ref.get();
    const entity = mapDocToEntity<Project>(snap);
    if (!entity) throw new Error("Project oluşturulamadı");
    return entity;
  },

  async update(
    id: string,
    data: {
      slug?: string;
      title?: string;
      description?: string;
      techStack?: string;
      technologies?: string | null;
      challenge?: string;
      solution?: string;
      isFeatured?: boolean;
      githubUrl?: string | null;
      demoUrl?: string | null;
      imageUrl?: string | null;
      imageAlt?: string | null;
      orderNum?: number;
      caseStudyContent?: string;
    }
  ): Promise<Project> {
    const ref = col().doc(id);
    const patch = stripUndefined(data);
    await ref.update({ ...patch, updatedAt: FieldValue.serverTimestamp() });
    const snap = await ref.get();
    const entity = mapDocToEntity<Project>(snap);
    if (!entity) throw new Error("Project bulunamadı");
    return entity;
  },

  async delete(id: string): Promise<Project> {
    const ref = col().doc(id);
    const snap = await ref.get();
    const entity = mapDocToEntity<Project>(snap);
    if (!entity) throw new Error("Project bulunamadı");
    await ref.delete();
    return entity;
  },
};

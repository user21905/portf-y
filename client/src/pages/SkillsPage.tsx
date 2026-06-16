import { PageLayout } from "@/components/Layout/PageLayout";
import { useContent } from "@/hooks/useContent";
import {
  SKILL_CATEGORY_LABELS,
  SKILL_CATEGORY_ORDER,
  SKILL_CATEGORY_DESCRIPTIONS,
} from "@/config/constants";
import type { Skill } from "@/types/content";
import styles from "./SkillsPage.module.css";

function groupByCategory(skills: Skill[]) {
  const groups: Record<string, Skill[]> = {};
  for (const s of skills) {
    const key = SKILL_CATEGORY_LABELS[s.category] ?? s.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  return groups;
}

function getSkillKey(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("typescript") || n === "ts") return "typescript";
  if (n.includes("javascript")) return "javascript";
  if (n.includes("sql")) return "sql";
  if (n.includes("react")) return "react";
  if (n.includes("next")) return "nextjs";
  if (n.includes("vue")) return "vue";
  if (n.includes("node")) return "nodejs";
  if (n.includes("express")) return "express";
  if (n.includes("prisma")) return "prisma";
  if (n.includes("postgres")) return "postgres";
  if (n.includes("mongo")) return "mongodb";
  if (n.includes("webrtc")) return "webrtc";
  if (n.includes("electron")) return "electron";
  if (n.includes("udp")) return "udp";
  if (n.includes("socket")) return "socketio";
  return "default";
}

function getSkillGlyph(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("typescript") || n === "ts") return "TS";
  if (n.includes("javascript")) return "JS";
  if (n.includes("sql")) return "SQL";
  if (n.includes("react")) return "Re";
  if (n.includes("next")) return "Nx";
  if (n.includes("vue")) return "Vu";
  if (n.includes("node")) return "Nd";
  if (n.includes("express")) return "Ex";
  if (n.includes("prisma")) return "Pr";
  if (n.includes("postgres")) return "PG";
  if (n.includes("mongo")) return "Mg";
  if (n.includes("webrtc")) return "RTC";
  if (n.includes("electron")) return "El";
  if (n.includes("udp")) return "UDP";
  if (n.includes("socket")) return "IO";
  return name.slice(0, 2).toUpperCase();
}

function getCategoryDescription(categoryKey: string, label: string): string {
  return SKILL_CATEGORY_DESCRIPTIONS[categoryKey] ?? `${label} alanında production deneyimi.`;
}

export function SkillsPage() {
  const { content } = useContent();

  if (!content) {
    return null;
  }

  const groups = groupByCategory(content.skills);

  const sectionKeys = Object.keys(groups).sort((a, b) => {
    const labelToKey = (label: string) =>
      Object.entries(SKILL_CATEGORY_LABELS).find(([, v]) => v === label)?.[0] ?? label;
    const ai = SKILL_CATEGORY_ORDER.indexOf(labelToKey(a) as (typeof SKILL_CATEGORY_ORDER)[number]);
    const bi = SKILL_CATEGORY_ORDER.indexOf(labelToKey(b) as (typeof SKILL_CATEGORY_ORDER)[number]);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <PageLayout settings={content.settings}>
      <div className="container">
        <h1 className={styles.title}>Yetkinlikler</h1>
        <p className={styles.subtitle}>
          Production ortamlarında günlük kullandığım stack — dillerden protokollere, uçtan uca
          teslim edilebilir mimariler kurmak için tasarlandı.
        </p>
        <div className={styles.grid}>
          {sectionKeys.map((label) => {
            const items = groups[label];
            if (!items?.length) return null;
            const categoryKey =
              Object.entries(SKILL_CATEGORY_LABELS).find(([, v]) => v === label)?.[0] ?? label;
            return (
              <section key={label} className={styles.section}>
                <h2 className={styles.category}>{label}</h2>
                <p className={styles.categoryDesc}>
                  {getCategoryDescription(categoryKey, label)}
                </p>
                <div className={styles.cardGrid}>
                  {items.map((skill) => (
                    <div key={skill.id} className={styles.card}>
                      <div
                        className={styles.cardIcon}
                        data-skill={getSkillKey(skill.name)}
                        aria-hidden="true"
                      >
                        {getSkillGlyph(skill.name)}
                      </div>
                      <span className={styles.cardName}>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}

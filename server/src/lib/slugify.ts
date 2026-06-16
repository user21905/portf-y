const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugifyTitle(title: string): string {
  const t = title
    .trim()
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return t.slice(0, 80) || "proje";
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length <= 100;
}

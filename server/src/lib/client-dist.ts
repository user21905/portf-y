import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const thisDir = path.dirname(fileURLToPath(import.meta.url));

/** Olası client/dist konumları (monorepo + Render cwd farkları) */
const CLIENT_DIST_CANDIDATES = [
  path.resolve(thisDir, "../../../client/dist"), // server/dist/lib → kök
  path.resolve(thisDir, "../../client/dist"), // server/dist → kök (yedek)
  path.resolve(process.cwd(), "client/dist"), // npm start kök dizinden
  path.resolve(process.cwd(), "../client/dist"), // cwd = server/
];

function resolveClientDistDir(): string {
  for (const candidate of CLIENT_DIST_CANDIDATES) {
    if (fs.existsSync(path.join(candidate, "index.html"))) {
      return candidate;
    }
  }
  return CLIENT_DIST_CANDIDATES[0];
}

export const CLIENT_DIST_DIR = resolveClientDistDir();

export function clientDistExists(): boolean {
  return fs.existsSync(path.join(CLIENT_DIST_DIR, "index.html"));
}

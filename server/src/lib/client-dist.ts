import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDistDir = path.dirname(fileURLToPath(import.meta.url));

/** Derlenmiş React build: server/dist → ../../client/dist */
export const CLIENT_DIST_DIR = path.resolve(serverDistDir, "../../client/dist");

export function clientDistExists(): boolean {
  return fs.existsSync(path.join(CLIENT_DIST_DIR, "index.html"));
}

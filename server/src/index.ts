import app from "./app.js";
import { env } from "./config/env.js";
import { CLIENT_DIST_DIR, clientDistExists } from "./lib/client-dist.js";

app.listen(env.port, "0.0.0.0", () => {
  const mode = env.isProduction ? "production" : "development";
  const hasSpa = env.isProduction && clientDistExists();
  const spa = hasSpa ? " + SPA" : "";
  console.log(`Server listening on 0.0.0.0:${env.port} (${mode}${spa})`);
  if (env.isProduction && !hasSpa) {
    console.warn(`[WARN] client/dist bulunamadi — aranan: ${CLIENT_DIST_DIR}`);
  } else if (hasSpa) {
    console.log(`[SPA] Statik dosyalar: ${CLIENT_DIST_DIR}`);
  }
});

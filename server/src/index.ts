import app from "./app.js";
import { env } from "./config/env.js";
import { clientDistExists } from "./lib/client-dist.js";

app.listen(env.port, "0.0.0.0", () => {
  const mode = env.isProduction ? "production" : "development";
  const spa = env.isProduction && clientDistExists() ? " + SPA" : "";
  console.log(`Server listening on 0.0.0.0:${env.port} (${mode}${spa})`);
});

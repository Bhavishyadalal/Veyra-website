import { defineConfig, loadEnv } from "vite";
import { socialMetadata } from "./scripts/social-metadata.mjs";
import { socialSettings } from "./social.config.mjs";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
const page = (name) => fileURLToPath(new URL(name, import.meta.url));
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl =
    env.SITE_URL ||
    socialSettings.siteUrl ||
    (env.VERCEL_PROJECT_PRODUCTION_URL
      ? "https://" + env.VERCEL_PROJECT_PRODUCTION_URL
      : "");
  return {
    plugins: [react(), tailwindcss(), socialMetadata(siteUrl)],
    base: "./",
    resolve: { alias: { "@": page("./src") } },
    build: {
      target: "es2020",
      assetsInlineLimit: 0,
      rollupOptions: {
        input: {
          main: page("index.html"),
          privacy: page("privacy.html"),
          credits: page("credits.html"),
          media: page("media.html"),
        },
      },
    },
    server: { port: 5173 },
    preview: { port: 4173, strictPort: true },
  };
});

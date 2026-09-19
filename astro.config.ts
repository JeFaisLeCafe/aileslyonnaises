import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const excludedFromSitemap = new Set([
  "https://www.aileslyonnaises.com/404/",
  "https://www.aileslyonnaises.com/404.html",
]);

export default defineConfig({
  site: "https://www.aileslyonnaises.com",
  integrations: [
    sitemap({
      filter: (page) => !excludedFromSitemap.has(page),
    }),
  ],
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
});

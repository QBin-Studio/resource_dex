import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: [
      {
        find: "~api/",
        replacement: path.resolve(__dirname, "src/api") + "/",
      },
      {
        find: "~/",
        replacement: path.resolve(__dirname, "src") + "/",
      },
    ],
  },
});

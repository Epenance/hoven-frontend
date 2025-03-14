// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    image: {
        remotePatterns: [{ protocol: "https" }],
    },
    vite: {
      plugins: [tailwindcss()],
    },
    integrations: [react()],
});
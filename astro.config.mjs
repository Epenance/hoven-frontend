// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    image: {
        domains: ['localhost', 'hoven-cms-production.up.railway.app'],
    },
    vite: {
      plugins: [tailwindcss()],
    },
    integrations: [react()],
});
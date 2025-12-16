// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

import react from "@astrojs/react";

import sitemap from '@astrojs/sitemap';

import partytown from '@astrojs/partytown';

// @ts-ignore
const {SITE_URL, CMS_DOMAIN} = loadEnv(process.env.NODE_ENV, process.cwd(), "");

console.log('SITE_URL', SITE_URL)
console.log('CMS_DOMAIN', CMS_DOMAIN)

// https://astro.build/config
export default defineConfig({
    site: SITE_URL ? SITE_URL : undefined,
    image: {
        domains: ['hoven-cms-production.up.railway.app', CMS_DOMAIN],
    },
    vite: {
      plugins: [tailwindcss()],
    },
    integrations: [react(), sitemap(), partytown({ config: { forward: ['dataLayer.push'] } })],
});
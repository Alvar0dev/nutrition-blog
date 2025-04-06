import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
// Tailwind CSS 3 runs through Vite's native PostCSS pipeline (postcss.config.js).
// The deprecated @astrojs/tailwind integration is not compatible with Astro 7.
export default defineConfig({
  site: 'https://nutricionalcoach.com',
  integrations: [react()],
  image: {
    domains: ['images.pexels.com'],
  },
});

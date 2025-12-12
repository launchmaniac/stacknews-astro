// @ts-check
// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Server-side rendering for API caching

  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
    sessions: {
      enabled: false
    }
  }),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['node:buffer', 'node:crypto']
    }
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});

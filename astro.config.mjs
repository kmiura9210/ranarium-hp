// @ts-check
import { defineConfig, sessionDrivers } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';
import { writeFile } from 'node:fs/promises';

const isDevSite = process.env.PUBLIC_SITE_ENV === 'development';

// https://astro.build/config
export default defineConfig({
  // セッションを使用しない開発サイトでは共有KVを作成しない。
  ...(isDevSite ? { session: { driver: sessionDrivers.memory() } } : {}),
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare(isDevSite ? { configPath: './wrangler.dev.jsonc' } : {}),
  integrations: isDevSite ? [{
    name: 'development-site-indexing',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n');
        await writeFile(new URL('robots.txt', dir), 'User-agent: *\nDisallow: /\n');
      }
    }
  }] : []
});
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData(source, filePath) {
            // style.scss と global/ 配下には自動注入しない（循環参照回避）
            if (filePath.includes('style.scss') || filePath.includes('/global/')) {
              return source;
            }
            return `@use "${new URL('./src/styles/global', import.meta.url).pathname}" as *;\n${source}`;
          },
        },
      },
    },
  },
});
